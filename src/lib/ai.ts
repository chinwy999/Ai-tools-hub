import { db } from "@/db";
import { toolRuns } from "@/db/schema";
import {
  type ChatMessage,
  type GroqError,
  groqChat,
  groqChatJson,
  isGroqEnabled,
} from "./groq";
import { clientIdentifier, rateLimit } from "./rate-limit";

export type ToolEngine = "groq" | "demo";

export type ToolMeta = {
  engine: ToolEngine;
  model: string | null;
  elapsedMs: number;
  notice: string | null;
};

export type ApiResponse<T> =
  | { ok: true; tool: string; result: T; meta: ToolMeta }
  | { ok: false; tool: string; error: string; meta: ToolMeta };

const DEMO_NOTICE =
  "تعمل الأداة حالياً بالمحرك التجريبي المحلي. أضف مفتاح GROQ_API_KEY في ملف .env.local لتشغيل نموذج Llama 3 الكامل.";

const emptyMeta = (elapsedMs = 0): ToolMeta => ({
  engine: "demo",
  model: null,
  elapsedMs,
  notice: null,
});

/* ------------------------------------------------------------------ */
/*  التحقق من المدخلات + حد الطلبات                                    */
/* ------------------------------------------------------------------ */

type ParsedBody = Record<string, unknown>;

async function readBody(request: Request): Promise<ParsedBody> {
  try {
    const body = (await request.json()) as unknown;
    if (body && typeof body === "object" && !Array.isArray(body)) {
      return body as ParsedBody;
    }
    return {};
  } catch {
    return {};
  }
}

export function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export type GuardResult =
  | { ok: true; body: ParsedBody; input: string }
  | { ok: false; response: Response };

export async function guardRequest(
  request: Request,
  tool: string,
  options: { min?: number; max?: number; field?: string } = {},
): Promise<GuardResult> {
  const limit = rateLimit(`${clientIdentifier(request)}:${tool}`);
  if (!limit.allowed) {
    return {
      ok: false,
      response: Response.json(
        {
          ok: false,
          tool,
          error: `تجاوزت الحد المسموح من الطلبات (${limit.limit} طلبات في الدقيقة). يرجى المحاولة بعد ${limit.retryAfterSeconds} ثانية.`,
          meta: emptyMeta(),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.retryAfterSeconds),
            "X-RateLimit-Limit": String(limit.limit),
            "X-RateLimit-Remaining": "0",
          },
        },
      ),
    };
  }

  const body = await readBody(request);
  const input = asString(body[options.field ?? "text"] ?? asString(body.input)).trim();

  const min = options.min ?? 2;
  const max = options.max ?? 8000;

  if (!input) {
    return {
      ok: false,
      response: Response.json(
        {
          ok: false,
          tool,
          error: "يرجى كتابة النص المطلوب معالجته قبل الضغط على الزر.",
          meta: emptyMeta(),
        },
        { status: 400 },
      ),
    };
  }

  if (input.length < min) {
    return {
      ok: false,
      response: Response.json(
        {
          ok: false,
          tool,
          error: `النص قصير جداً. يرجى إدخال ${min} حرفاً على الأقل للحصول على نتيجة دقيقة.`,
          meta: emptyMeta(),
        },
        { status: 400 },
      ),
    };
  }

  if (input.length > max) {
    return {
      ok: false,
      response: Response.json(
        {
          ok: false,
          tool,
          error: `النص طويل جداً (${input.length} حرف). الحد الأقصى المسموح هو ${max} حرف.`,
          meta: emptyMeta(),
        },
        { status: 413 },
      ),
    };
  }

  return { ok: true, body, input };
}

/* ------------------------------------------------------------------ */
/*  التنفيذ الموحّد للأدوات                                            */
/* ------------------------------------------------------------------ */

type RunOptions<T> = {
  request: Request;
  tool: string;
  input: string;
  body: ParsedBody;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  mode?: "text" | "json";
  parse: (raw: string) => T | null;
  validate?: (value: unknown) => T | null;
  demo: () => T;
  language?: string | null;
  label?: string | null;
};

async function logRun(entry: {
  tool: string;
  engine: ToolEngine;
  model: string | null;
  success: boolean;
  latencyMs: number;
  inputChars: number;
  outputChars: number;
  language?: string | null;
  label?: string | null;
  errorMessage?: string | null;
}) {
  if (!db) {
    return;
  }

  try {
    await db.insert(toolRuns).values({
      tool: entry.tool,
      engine: entry.engine,
      model: entry.model,
      success: entry.success,
      latencyMs: Math.min(entry.latencyMs, 3_600_000),
      inputChars: entry.inputChars,
      outputChars: entry.outputChars,
      language: entry.language ?? null,
      label: entry.label ?? null,
      errorMessage: entry.errorMessage ?? null,
    });
  } catch {
    // تسجيل الإحصائيات لا يجب أن يعطّل الأداة
  }
}

export async function runTool<T>(options: RunOptions<T>): Promise<Response> {
  const started = Date.now();
  const {
    tool,
    input,
    body,
    messages,
    temperature = 0.6,
    maxTokens = 1800,
    mode = "text",
    parse,
    validate,
    demo,
    language,
    label,
  } = options;

  const finish = (
    payload: ApiResponse<T>,
    status: number,
    extra: { engine: ToolEngine; model: string | null; outputChars: number; errorMessage?: string },
  ) => {
    void logRun({
      tool,
      engine: extra.engine,
      model: extra.model,
      success: status < 400,
      latencyMs: Date.now() - started,
      inputChars: input.length,
      outputChars: extra.outputChars,
      language: language ?? null,
      label: label ?? null,
      errorMessage: extra.errorMessage ?? null,
    });
    return Response.json(payload, { status });
  };

  // 1) وضع تجريبي محلي عند غياب المفتاح
  if (!isGroqEnabled()) {
    const result = demo();
    return finish(
      {
        ok: true,
        tool,
        result,
        meta: { engine: "demo", model: "محرك تجريبي محلي", elapsedMs: Date.now() - started, notice: DEMO_NOTICE },
      },
      200,
      { engine: "demo", model: null, outputChars: JSON.stringify(result).length },
    );
  }

  const failWithDemo = (reason: string) => {
    const result = demo();
    return finish(
      {
        ok: true,
        tool,
        result,
        meta: {
          engine: "demo",
          model: "محرك تجريبي محلي",
          elapsedMs: Date.now() - started,
          notice: `تعذّر تنفيذ الطلب عبر الذكاء الاصطناعي (${reason}). تم عرض نتيجة المحرك التجريبي المحلي بدلاً منها.`,
        },
      },
      200,
      {
        engine: "demo",
        model: null,
        outputChars: JSON.stringify(result).length,
        errorMessage: reason,
      },
    );
  };

  try {
    if (mode === "json" && validate) {
      const { data, model } = await groqChatJson<T>(
        { messages, temperature, maxTokens },
        validate,
      );
      return finish(
        {
          ok: true,
          tool,
          result: data,
          meta: { engine: "groq", model, elapsedMs: Date.now() - started, notice: null },
        },
        200,
        { engine: "groq", model, outputChars: JSON.stringify(data).length },
      );
    }

    const { text, model } = await groqChat({ messages, temperature, maxTokens });
    const parsed = parse(text);
    if (parsed === null) {
      return failWithDemo("نتيجة غير صالحة من النموذج");
    }

    return finish(
      {
        ok: true,
        tool,
        result: parsed,
        meta: { engine: "groq", model, elapsedMs: Date.now() - started, notice: null },
      },
      200,
      { engine: "groq", model, outputChars: text.length },
    );
  } catch (error) {
    const groqError = error as GroqError;
    const reason = groqError?.message ?? "خطأ غير معروف";
    console.error(`[${tool}] Groq error:`, reason);

    if (/GROQ_API_KEY|لم يتم ضبط مفتاح/i.test(reason)) {
      return finish(
        {
          ok: false,
          tool,
          error: "مفتاح الذكاء الاصطناعي غير مضبوط على السيرفر. يرجى إضافة GROQ_API_KEY في ملف .env.local ثم إعادة تشغيل المشروع.",
          meta: emptyMeta(Date.now() - started),
        },
        503,
        { engine: "demo", model: null, outputChars: 0, errorMessage: reason },
      );
    }

    if (/401|Unauthorized|invalid_api_key/i.test(reason)) {
      return finish(
        {
          ok: false,
          tool,
          error: "مفتاح GROQ_API_KEY غير صحيح أو منتهي الصلاحية. يرجى إنشاء مفتاح جديد من console.groq.com.",
          meta: emptyMeta(Date.now() - started),
        },
        401,
        { engine: "demo", model: null, outputChars: 0, errorMessage: reason },
      );
    }

    if (/429|rate limit|quota/i.test(reason)) {
      return finish(
        {
          ok: false,
          tool,
          error: "تم تجاوز الحد المسموح من خدمة Groq مؤقتاً. انتظر دقيقة واحدة ثم أعد المحاولة.",
          meta: emptyMeta(Date.now() - started),
        },
        429,
        { engine: "demo", model: null, outputChars: 0, errorMessage: reason },
      );
    }

    return failWithDemo(reason);
  }
}

/** قراءة حقل نصّي إضافي من جسم الطلب (مثل اللغة الهدف). */
export function bodyField(body: ParsedBody, key: string): string {
  return asString(body[key]);
}
