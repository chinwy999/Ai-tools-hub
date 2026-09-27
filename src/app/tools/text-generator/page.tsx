import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import { getTool } from "@/lib/tools";

const tool = getTool("text-generator");

export const metadata: Metadata = {
  title: tool?.seoTitle ?? "مولد النصوص",
  description: tool?.seoDescription,
  alternates: { canonical: "/tools/text-generator" },
  openGraph: {
    title: tool?.seoTitle,
    description: tool?.seoDescription,
    url: "/tools/text-generator",
    type: "website",
  },
};

export default function TextGeneratorPage() {
  if (!tool) return null;
  return <ToolPageShell tool={tool} />;
}
