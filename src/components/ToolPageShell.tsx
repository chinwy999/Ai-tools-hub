import Link from "next/link";
import { ChevronLeft, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";
import ToolWorkspace from "@/components/ToolWorkspace";
import { TOOLS, type ToolDefinition } from "@/lib/tools";

export default function ToolPageShell({ tool }: { tool: ToolDefinition }) {
  const others = TOOLS.filter((item) => item.slug !== tool.slug).slice(0, 4);
  const Icon = tool.icon;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6">
      {/* مسار التنقل */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <Link href="/" className="transition hover:text-white">
          الرئيسية
        </Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-slate-500">الأدوات</span>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-white">{tool.shortName}</span>
      </nav>

      {/* ترويسة الأداة */}
      <header className="glass-card animate-fade-up relative mt-5 overflow-hidden rounded-3xl p-6 sm:p-8">
        <span
          className={`pointer-events-none absolute -top-24 -start-16 h-56 w-56 rounded-full ${tool.glow} blur-3xl`}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <span
            className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tool.accentFrom} ${tool.accentTo} shadow-lg shadow-slate-950/50`}
          >
            <Icon className="h-8 w-8 text-white" />
          </span>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{tool.name}</h1>
            <p className={`mt-2 text-sm font-bold ${tool.accentFrom.replace("from-", "text-")}`}>
              {tool.tagline}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              {tool.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.features.map((feature) => (
                <span
                  key={feature}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${tool.chip}`}
                >
                  <Sparkles className="h-3 w-3" />
                  {feature}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-200">
                <ShieldCheck className="h-3 w-3" />
                بدون تسجيل
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* منطقة العمل */}
      <div className="mt-6">
        <ToolWorkspace slug={tool.slug} />
      </div>

      {/* نصائح */}
      <section className="glass-card animate-fade-up anim-delay-2 mt-6 rounded-3xl p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold text-white">
          <Lightbulb className="h-4 w-4 text-amber-300" />
          نصائح للحصول على أفضل نتيجة
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {tool.tips.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-black/25 p-3.5 text-xs leading-6 text-slate-300"
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tool.accentFrom.replace("from-", "bg-")}`}
              />
              {tip}
            </li>
          ))}
          <li className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-black/25 p-3.5 text-xs leading-6 text-slate-300">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tool.accentFrom.replace("from-", "bg-")}`}
            />
            استخدم اختصار <span className="font-bold text-white">Ctrl + Enter</span> لتنفيذ
            العملية بسرعة دون استخدام الفأرة.
          </li>
          <li className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-black/25 p-3.5 text-xs leading-6 text-slate-300">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tool.accentFrom.replace("from-", "bg-")}`}
            />
            يمكنك تحميل النتيجة كملف نصي (<span className="font-mono">.txt</span>) أو نسخها
            مباشرة إلى الحافظة.
          </li>
        </ul>
      </section>

      {/* أدوات أخرى */}
      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-white">أدوات أخرى قد تفيدك</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => {
            const OtherIcon = item.icon;
            return (
              <Link
                key={item.slug}
                href={`/tools/${item.slug}`}
                className="glass-card group flex items-center gap-3 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/25"
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.accentFrom} ${item.accentTo} transition-transform duration-300 group-hover:scale-110`}
                >
                  <OtherIcon className="h-5 w-5 text-white" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-white">
                    {item.shortName}
                  </span>
                  <span className="block truncate text-[11px] text-slate-400">
                    {item.tagline}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
