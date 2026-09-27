import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools";

type ToolCardProps = {
  tool: ToolDefinition;
  index?: number;
  runs?: number;
};

export default function ToolCard({ tool, index = 0, runs }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link
      href={`/tools/${tool.slug}`}
        className={`group glass-card animate-fade-up relative flex h-full flex-col overflow-hidden rounded-3xl p-6 ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 ${tool.ring} anim-delay-${Math.min(
        index + 1,
        5,
      )}`}
    >
      {/* هالة ضوئية عند التحويم */}
      <span
        className={`pointer-events-none absolute -top-16 -end-10 h-40 w-40 rounded-full ${tool.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tool.accentFrom} ${tool.accentTo} shadow-lg shadow-slate-950/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="h-7 w-7 text-white" />
        </span>
        {typeof runs === "number" && runs > 0 ? (
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${tool.chip}`}>
            {runs.toLocaleString("ar-EG")} استخدام
          </span>
        ) : (
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300">
            مجاني
          </span>
        )}
      </div>

      <h3 className="relative mt-5 text-xl font-extrabold text-white">{tool.shortName}</h3>
      <p className="relative mt-1 text-sm font-semibold text-slate-400">{tool.tagline}</p>
      <p className="relative mt-3 flex-1 text-sm leading-7 text-slate-300/90">
        {tool.description}
      </p>

      <ul className="relative mt-4 space-y-1.5">
        {tool.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className={`h-3.5 w-3.5 shrink-0 ${tool.accentFrom.replace("from-", "text-")}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">
        استخدم الأداة
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
      </span>
    </Link>
  );
}
