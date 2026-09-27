import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import { getTool } from "@/lib/tools";

const tool = getTool("summarizer");

export const metadata: Metadata = {
  title: tool?.seoTitle ?? "ملخص النصوص",
  description: tool?.seoDescription,
  alternates: { canonical: "/tools/summarizer" },
  openGraph: {
    title: tool?.seoTitle,
    description: tool?.seoDescription,
    url: "/tools/summarizer",
    type: "website",
  },
};

export default function SummarizerPage() {
  if (!tool) return null;
  return <ToolPageShell tool={tool} />;
}
