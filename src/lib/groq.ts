/**
 * طبقة الاتصال مع Groq API (متوافقة مع OpenAI).
 * الوثائق: https://console.groq.com/docs/api-reference
 */

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/** النموذج الأساسي — يمكن تغييره عبر GROQ_MODEL */
export const PRIMARY_MODEL =
  process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

/**
 * نماذج بديلة تُجرَّب تلقائياً إذا لم يكن النموذج الأساسي متاحاً
 * (بعض النماذج القديمة مثل llama3-70b-8192 تم إيقافها من Groq).
 */
const FALLBACK_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "openai/gpt-oss-20b",
];

export function getGroqApiKey(): string | null {
  const key = process.env.GROQ_API_KEY?.trim();
  return key && key.length > 10 ? key : null;
}

export function isGroqEnabled(): boolean {
  return getGroqApiKey() !== null;
}

export class GroqError extends Error {}

type GroqOptions = {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
  timeoutMs?: number;
};

type GroqChoice = {
  message?: { content?: string | null };
};

type GroqResponse = {
  choices?: GroqChoice[];
  model?: string;
  error?: { message?: string };
};

function candidateModels(): string[] {
  const list = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  return list.filter((model, index) => list.indexOf(model) === index);
}

function isModelUnavailable(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("decommissioned") ||
    normalized.includes("not found") ||
    normalized.includes("does not exist") ||
    normalized.includes("no longer available") ||
    normalized.includes("model_not_found") ||
    normalized.includes("invalid model")
  );
}

/** إرسال طلب واحد إلى Groq واستخراج النص الناتج. */
async function requestGroq(
  model: string,
  { messages, temperature = 0.6, maxTokens = 1600, json, timeoutMs = 45000 }: GroqOptions,
  apiKey: string,
): Promise<{ text: string; model: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    const raw = await response.text();
    let payload: GroqResponse = {};
    try {
      payload = raw ? (JSON.parse(raw) as GroqResponse) : {};
    } catch {
      payload = {};
    }

    if (!response.ok) {
      const message =
        payload.error?.message || `فشل الطلب إلى Groq (رمز ${response.status})`;
      const error = new GroqError(message);
      (error as GroqError & { unavailable?: boolean }).unavailable =
        isModelUnavailable(message);
      throw error;
    }

    const text = payload.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) {
      throw new GroqError("لم يُعد النموذج أي نتيجة.");
    }

    return { text, model: payload.model || model };
  } catch (error) {
    if (error instanceof GroqError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new GroqError("انتهت مدة الانتظار أثناء الاتصال بخدمة الذكاء الاصطناعي.");
    }
    throw new GroqError(
      error instanceof Error ? error.message : "تعذر الاتصال بخدمة الذكاء الاصطناعي.",
    );
  } finally {
    clearTimeout(timer);
  }
}

/**
 * استدعاء نموذج المحادثة مع تبديل تلقائي بين النماذج المتاحة.
 */
export async function groqChat(
  options: GroqOptions,
): Promise<{ text: string; model: string }> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new GroqError("لم يتم ضبط مفتاح GROQ_API_KEY.");
  }

  const models = candidateModels();
  let lastError: unknown;

  for (const model of models) {
    try {
      return await requestGroq(model, options, apiKey);
    } catch (error) {
      lastError = error;
      const unavailable = (error as GroqError & { unavailable?: boolean })
        .unavailable;
      if (unavailable) continue; // جرّب النموذج التالي
      throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new GroqError("تعذّر تنفيذ الطلب عبر جميع النماذج المتاحة.");
}

/** استدعاء يضمن استلام JSON صالح. */
export async function groqChatJson<T>(
  options: GroqOptions,
  validate: (value: unknown) => T | null,
): Promise<{ data: T; model: string }> {
  const attempt = async (extraHint: boolean) => {
    const messages = extraHint
      ? [
          ...options.messages,
          {
            role: "user" as const,
            content: "أعد النتيجة بصيغة JSON صحيحة فقط دون أي شرح أو علامات markdown.",
          },
        ]
      : options.messages;

    const { text, model } = await groqChat({ ...options, messages, json: true });
    const cleaned = text
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    const candidate = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;

    try {
      const parsed = JSON.parse(candidate) as unknown;
      const data = validate(parsed);
      if (data === null) throw new GroqError("بنية النتيجة غير صحيحة.");
      return { data, model };
    } catch {
      return null;
    }
  };

  const first = await attempt(false);
  if (first) return first;
  const second = await attempt(true);
  if (second) return second;

  throw new GroqError("تعذّر تحليل نتيجة النموذج.");
}
