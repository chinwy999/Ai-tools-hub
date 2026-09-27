import Link from "next/link";
import { ExternalLink, Heart, Shield, Sparkles, Zap } from "lucide-react";
import { SITE, TOOLS } from "@/lib/tools";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-900/40">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-lg font-extrabold text-white">{SITE.name}</p>
              <p className="text-xs text-slate-400">{SITE.nameAr}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            منصة عربية مجانية بالكامل تجمع خمس أدوات ذكاء اصطناعي عملية في مكان واحد:
            توليد النصوص، التلخيص، الترجمة الفورية، تحسين الكتابة، وتحليل المشاعر. بدون
            تسجيل، وبدون رسوم، وبدون حدود مخفية.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              <Shield className="h-3.5 w-3.5" /> 100% مجاني
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <Zap className="h-3.5 w-3.5" /> استجابة فورية
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-200">
              <Heart className="h-3.5 w-3.5" /> مبني للمحتوى العربي
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">الأدوات</h3>
          <ul className="mt-4 space-y-2.5">
            {TOOLS.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  <span className="me-1.5">{tool.emoji}</span>
                  {tool.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">روابط سريعة</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/" className="text-sm text-slate-400 transition hover:text-white">
                الصفحة الرئيسية
              </Link>
            </li>
            <li>
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Groq Console
              </a>
            </li>
            <li>
              <a
                href="/api/stats"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                واجهة الإحصائيات
              </a>
            </li>
            <li>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Next.js
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 sm:px-6">
        <p className="mx-auto max-w-6xl text-center text-xs text-slate-500">
          © {year} {SITE.name} — جميع الحقوق محفوظة. مبني بـ Next.js و Tailwind CSS
          ونموذج Llama 3 عبر Groq.
        </p>
      </div>
    </footer>
  );
}
