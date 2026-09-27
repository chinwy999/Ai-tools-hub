import { guardRequest, runTool } from "@/lib/ai";
import { demoSummarize } from "@/lib/demo-engine";
import { TOOLS } from "@/lib/tools";
import type { ChatMessage } from "@/lib/groq";

export const dynamic = "force-dynamic";

const tool = TOOLS.find((item) => item.slug === "summarizer")!;

export async function POST(request: Request) {
  const guard = await guardRequest(request, tool.slug, {
    min: tool.minLength,
    max: tool.maxLength,
    field: "text",
  });
  if (!guard.ok) return guard.response;

  const { input, body } = guard;
  const requested =
    Number.parseInt(typeof body.points === "string" ? body.points : "", 10) || 0;
  const pointCount = Math.min(5, Math.max(3, requested || 4));

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "أنت خبير في تلخيص النصوص العربية والإنجليزية. تختار الأفكار الجوهرية فقط دون إضافة معلومات من عندك، وتكتب بأسلوب عربي واضح وموجز.",
    },
    {
      role: "user",
      content: `لخّص النص التالي في ${pointCount} نقاط رئيسية دقيقة.\n\nالقواعد:\n- كل نقطة في سطر مستقل تبدأ بالعلامة -\n- لا تستخدم عناوين أو ترقيم أو تنسيق Markdown\n- لا تضف معلومات غير موجودة في النص\n- طول كل نقطة بين 12 و30 كلمة\n\nالنص:\n"""\n${input}\n"""`,
    },
  ];

  return runTool<{ points: string[] }>({
    request,
    tool: tool.slug,
    input,
    body,
    messages,
    temperature: 0.3,
    maxTokens: 900,
    parse: (raw) => {
      const points = raw
        .split("\n")
        .map((line) =>
          line
            .replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "")
            .replace(/\*\*/g, "")
            .replace(/^#{1,6}\s*/, "")
            .trim(),
        )
        .filter((line) => line.length > 8)
        .slice(0, 6);
      return points.length > 0 ? { points } : null;
    },
    demo: () => ({ points: demoSummarize(input, pointCount) }),
  });
}
