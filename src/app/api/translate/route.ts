import { bodyField, guardRequest, runTool } from "@/lib/ai";
import { demoTranslate } from "@/lib/demo-engine";
import { LANGUAGES, TOOLS, languageName } from "@/lib/tools";
import type { ChatMessage } from "@/lib/groq";

export const dynamic = "force-dynamic";

const tool = TOOLS.find((item) => item.slug === "translator")!;

export async function POST(request: Request) {
  const guard = await guardRequest(request, tool.slug, {
    min: tool.minLength,
    max: tool.maxLength,
    field: "text",
  });
  if (!guard.ok) return guard.response;

  const { input, body } = guard;
  const targetCode = bodyField(body, "target") || "en";
  const sourceCode = bodyField(body, "source") || "auto";
  const target = LANGUAGES.find((lang) => lang.code === targetCode) ?? LANGUAGES[1];
  const targetName = target.name;
  const sourceName = sourceCode === "auto" ? "الكشف التلقائي" : languageName(sourceCode);

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "أنت مترجم محترف. تترجم النصوص بدقة وبأسلوب طبيعي يحافظ على المعنى والسياق والنبرة، دون ترجمة حرفية ركيكة. لا تشرح ولا تضف تعليقات؛ أعِد الترجمة فقط.",
    },
    {
      role: "user",
      content: `ترجم النص التالي من «${sourceName}» إلى «${targetName}».\n\nالقواعد:\n- حافظ على المعنى والنبرة الأصلية\n- ترجم الأسماء الخاصة نقلًا صوتيًا منطقيًا\n- أعِد الترجمة فقط دون أي شرح أو ملاحظات\n\nالنص:\n"""\n${input}\n"""`,
    },
  ];

  return runTool<{ text: string; targetLanguage: string }>({
    request,
    tool: tool.slug,
    input,
    body,
    messages,
    temperature: 0.2,
    maxTokens: 1600,
    language: target.code,
    parse: (raw) => {
      const cleaned = raw
        .replace(/^\s*(الترجمة|Translation)\s*[:：]\s*/i, "")
        .trim();
      return cleaned.length > 0
        ? { text: cleaned, targetLanguage: target.code }
        : null;
    },
    demo: () => {
      const result = demoTranslate(input, target.code, sourceCode);
      return { text: result.text, targetLanguage: target.code };
    },
  });
}
