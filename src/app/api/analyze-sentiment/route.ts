import { guardRequest, runTool } from "@/lib/ai";
import { demoSentiment, type SentimentResult } from "@/lib/demo-engine";
import { TOOLS } from "@/lib/tools";
import type { ChatMessage } from "@/lib/groq";

export const dynamic = "force-dynamic";

const tool = TOOLS.find((item) => item.slug === "sentiment")!;

function normalizeLabel(
  value: unknown,
): { label: SentimentResult["label"]; key: SentimentResult["labelKey"] } | null {
  const raw = typeof value === "string" ? value.toLowerCase().trim() : "";
  if (["positive", "إيجابي", "ايجابي", "إيجابية"].includes(raw)) {
    return { label: "إيجابي", key: "positive" };
  }
  if (["negative", "سلبي", "سلبية"].includes(raw)) {
    return { label: "سلبي", key: "negative" };
  }
  if (["neutral", "محايد", "محايده"].includes(raw)) {
    return { label: "محايد", key: "neutral" };
  }
  return null;
}

function clampPercent(value: unknown, fallback: number): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(100, Math.max(0, Math.round(num)));
}

function validateSentiment(value: unknown): SentimentResult | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  const normalized =
    normalizeLabel(obj.labelKey) ?? normalizeLabel(obj.sentiment) ?? normalizeLabel(obj.label);
  if (!normalized) return null;

  const rawScores = (obj.scores ?? obj.confidence_scores ?? {}) as Record<string, unknown>;
  const positive = clampPercent(rawScores.positive ?? rawScores.pos, 0);
  const negative = clampPercent(rawScores.negative ?? rawScores.neg, 0);
  const neutralRaw = rawScores.neutral ?? rawScores.neu;
  const neutral =
    neutralRaw === undefined
      ? Math.max(0, 100 - positive - negative)
      : clampPercent(neutralRaw, 0);
  const total = positive + negative + neutral || 1;

  const scores = {
    positive: Math.round((positive / total) * 100),
    negative: Math.round((negative / total) * 100),
    neutral: Math.round((neutral / total) * 100),
  };

  const dominant =
    normalized.key === "positive"
      ? scores.positive
      : normalized.key === "negative"
        ? scores.negative
        : scores.neutral;

  const confidenceRaw = typeof obj.confidence === "number" ? obj.confidence : dominant;
  const confidence = Math.min(
    99,
    Math.max(45, clampPercent(confidenceRaw <= 1 ? confidenceRaw * 100 : confidenceRaw, dominant)),
  );

  const keywords = Array.isArray(obj.keywords)
    ? obj.keywords
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 6)
    : [];

  const explanation =
    typeof obj.explanation === "string" && obj.explanation.trim().length > 10
      ? obj.explanation.trim()
      : `تم تصنيف النص على أنه ${normalized.label} بنسبة ثقة ${confidence}%.`;

  return {
    label: normalized.label,
    labelKey: normalized.key,
    confidence,
    scores,
    keywords,
    explanation,
  };
}

export async function POST(request: Request) {
  const guard = await guardRequest(request, tool.slug, {
    min: tool.minLength,
    max: tool.maxLength,
    field: "text",
  });
  if (!guard.ok) return guard.response;

  const { input, body } = guard;

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "أنت خبير في تحليل المشاعر وتصنيف النصوص بالعربية والإنجليزية. تحلل النص بموضوعية وتعطي نتائج دقيقة بصيغة JSON فقط دون أي نص إضافي.",
    },
    {
      role: "user",
      content: `حلّل مشاعر النص التالي وصنّفه (إيجابي / سلبي / محايد).\n\nأعد النتيجة بصيغة JSON فقط بهذا الشكل:\n{"labelKey":"positive|negative|neutral","label":"إيجابي|سلبي|محايد","confidence":رقم من 0 إلى 100,"scores":{"positive":رقم,"negative":رقم,"neutral":رقم},"keywords":["كلمات دالة عاطفية"],"explanation":"شرح موجز بالعربية في سطر أو سطرين"}\n\nملاحظة: مجموع القيم في scores يجب أن يكون 100.\n\nالنص:\n"""\n${input}\n"""`,
    },
  ];

  return runTool<SentimentResult>({
    request,
    tool: tool.slug,
    input,
    body,
    messages,
    temperature: 0.1,
    maxTokens: 800,
    mode: "json",
    parse: () => null,
    validate: validateSentiment,
    demo: () => demoSentiment(input),
    label: undefined,
  });
}
