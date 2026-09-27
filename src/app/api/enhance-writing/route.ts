import { bodyField, guardRequest, runTool } from "@/lib/ai";
import { demoEnhanceWriting } from "@/lib/demo-engine";
import { TOOLS } from "@/lib/tools";
import type { ChatMessage } from "@/lib/groq";

export const dynamic = "force-dynamic";

const tool = TOOLS.find((item) => item.slug === "writing-enhancer")!;

type Revision = { text: string; changes: string[] };

function validateRevision(value: unknown): Revision | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  const improved = typeof obj.improved === "string" ? obj.improved.trim() : "";
  if (improved.length < 5) return null;
  const changes = Array.isArray(obj.changes)
    ? obj.changes
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];
  return {
    text: improved,
    changes:
      changes.length > 0
        ? changes
        : ["تصحيح الأخطاء الإملائية والنحوية وتحسين الأسلوب العام."],
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
  const tone = bodyField(body, "tone") || "احترافي";

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "أنت محرر لغوي عربي خبير في التدقيق الإملائي والنحوي وتحسين الأسلوب. تحافظ على معنى النص الأصلي بالكامل ولا تضف معلومات جديدة.",
    },
    {
      role: "user",
      content: `دقّق وحسّن النص التالي بأسلوب «${tone}».\n\nالمطلوب:\n1) تصحيح كل الأخطاء الإملائية والنحوية وعلامات الترقيم\n2) تحسين الوضوح والانسيابية دون تغيير المعنى\n3) أعد النتيجة بصيغة JSON فقط بهذا الشكل:\n{"improved":"النص المصحح كاملاً","changes":["قائمة قصيرة بأهم التحسينات بالعربية"]}\n\nالنص:\n"""\n${input}\n"""`,
    },
  ];

  return runTool<Revision>({
    request,
    tool: tool.slug,
    input,
    body,
    messages,
    temperature: 0.25,
    maxTokens: 2000,
    mode: "json",
    parse: () => null,
    validate: validateRevision,
    demo: () => {
      const result = demoEnhanceWriting(input);
      return { text: result.text, changes: result.changes };
    },
  });
}
