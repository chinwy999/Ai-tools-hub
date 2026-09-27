import { Activity, Cpu, Gauge, Zap } from "lucide-react";
import type { UsageStats } from "@/lib/stats";

export default function UsageStats({ stats }: { stats: UsageStats }) {
  const cards = [
    {
      label: "إجمالي العمليات",
      value: stats.totalRuns,
      suffix: "عملية",
      icon: Activity,
      accent: "from-blue-500 to-indigo-600",
    },
    {
      label: "خلال 24 ساعة",
      value: stats.last24h,
      suffix: "عملية",
      icon: Zap,
      accent: "from-purple-500 to-fuchsia-600",
    },
    {
      label: "عمليات ناجحة",
      value: stats.successfulRuns,
      suffix: "عملية",
      icon: Cpu,
      accent: "from-emerald-500 to-teal-600",
    },
    {
      label: "متوسط زمن الاستجابة",
      value: averageLatency(stats),
      suffix: "مللي ثانية",
      icon: Gauge,
      accent: "from-orange-500 to-rose-600",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="glass-card rounded-3xl p-6 sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              إحصائيات الاستخدام الحية
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              أرقام حقيقية من قاعدة البيانات تُحدَّث مع كل عملية تُنفَّذ على المنصة.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
              stats.available
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : "border-slate-400/30 bg-slate-500/10 text-slate-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                stats.available ? "animate-pulse bg-emerald-400" : "bg-slate-400"
              }`}
            />
            {stats.available ? "قاعدة البيانات متصلة" : "في انتظار أول عملية"}
          </span>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="glass-soft rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${card.accent}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <p className="mt-3.5 text-2xl font-extrabold text-white">
                  {card.value.toLocaleString("ar-EG")}
                  <span className="ms-1.5 text-xs font-semibold text-slate-400">
                    {card.suffix}
                  </span>
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{card.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-7 space-y-3.5">
          {stats.perTool.map((row) => {
            const max = Math.max(...stats.perTool.map((item) => item.runs), 1);
            return (
              <div key={row.tool}>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{row.name}</span>
                  <span className="text-slate-500">
                    {row.runs.toLocaleString("ar-EG")} عملية
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500 transition-all duration-700"
                    style={{ width: `${Math.max(4, (row.runs / max) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function averageLatency(stats: UsageStats): number {
  const used = stats.perTool.filter((item) => item.runs > 0);
  if (used.length === 0) return 0;
  const weighted = used.reduce(
    (sum, item) => sum + item.avgLatencyMs * item.runs,
    0,
  );
  const total = used.reduce((sum, item) => sum + item.runs, 0);
  return Math.round(weighted / total);
}
