import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import { getTool } from "@/lib/tools";

const tool = getTool("sentiment");

export const metadata: Metadata = {
  title: tool?.seoTitle ?? "تحليل المشاعر",
  description: tool?.seoDescription,
  alternates: { canonical: "/tools/sentiment" },
  openGraph: {
    title: tool?.seoTitle,
    description: tool?.seoDescription,
    url: "/tools/sentiment",
    type: "website",
  },
};

export default function SentimentPage() {
  if (!tool) return null;
  return <ToolPageShell tool={tool} />;
}
