import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import { getTool } from "@/lib/tools";

const tool = getTool("writing-enhancer");

export const metadata: Metadata = {
  title: tool?.seoTitle ?? "تحسين الكتابة",
  description: tool?.seoDescription,
  alternates: { canonical: "/tools/writing-enhancer" },
  openGraph: {
    title: tool?.seoTitle,
    description: tool?.seoDescription,
    url: "/tools/writing-enhancer",
    type: "website",
  },
};

export default function WritingEnhancerPage() {
  if (!tool) return null;
  return <ToolPageShell tool={tool} />;
}
