import { runTool, guardRequest } from "@/lib/ai";
import { demoGenerateText } from "@/lib/demo-engine";
import { TOOLS } from "@/lib/tools";
import type { ChatMessage } from "@/lib/groq";

export const dynamic = "force-dynamic";

const tool = TOOLS.find((item) => item.slug === "text-generator")!;

export async function POST(request: Request) {
  const guard = await guardRequest(request, tool.slug, {
    min: tool.minLength,
    max: tool.maxLength,
    field: "topic",
  });
  if (!guard.ok) return guard.response;

  const { input, body } = guard;
  const style =
    typeof body.style === "string" && body.style.trim()
      ? body.style.trim()
      : "مقال احترافي";

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "أنت كاتب عربي محترف متخصص في كتابة المحتوى. اكتب نصوصاً عربية فصيحة واضحة وجذابة، منظمة بعناوين فرعية، دون مبالغة أو حشو. استخدم Markdown بسيطاً (## للعناوين، - للقوائم). اكتب النص فقط دون مقدمات حوارية مثل «بالتأكيد» أو «إليك النص».",
    },
    {
      role: "user",
      content: `اكتب ${style} عن الموضوع التالي:\n\n«${input}»\n\nالمطلوب: مقدمة قصيرة، من 3 إلى 5 عناوين فرعية مع فقرات موجزة، قائمة نقاط عملية، ثم خاتمة في 3 أسطر. الطول الإجمالي بين 350 و600 كلمة.`,
    },
  ];

  return runTool<{ text: string }>({
    request,
    tool: tool.slug,
    input,
    body,
    messages,
    temperature: 0.75,
    maxTokens: 1800,
    parse: (raw) => {
      const cleaned = raw
        .replace(/^\s*(بالتأكيد|إليك|إليك النص|هنا النص)[^\n]*\n/i, "")
        .trim();
      return cleaned.length > 40 ? { text: cleaned } : null;
    },
    demo: () => ({ text: demoGenerateText(input) }),
    label: style,
  });
}
