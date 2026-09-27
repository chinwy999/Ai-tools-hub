import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import { getTool } from "@/lib/tools";

const tool = getTool("translator");

export const metadata: Metadata = {
  title: tool?.seoTitle ?? "الترجمة الفورية",
  description: tool?.seoDescription,
  alternates: { canonical: "/tools/translator" },
  openGraph: {
    title: tool?.seoTitle,
    description: tool?.seoDescription,
    url: "/tools/translator",
    type: "website",
  },
};

export default function TranslatorPage() {
  if (!tool) return null;
  return <ToolPageShell tool={tool} />;
}
