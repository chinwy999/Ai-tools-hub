import Link from "next/link";
import {
  ArrowLeft,
  Gauge,
  Globe2,
  KeyRound,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import ToolCard from "@/components/ToolCard";
import UsageStats from "@/components/UsageStats";
import { getUsageStats } from "@/lib/stats";
import { SITE, TOOLS } from "@/lib/tools";

export const dynamic = "force-dynamic";

const ADVANTAGES = [
  {
    icon: ShieldCheck,
    title: "مجاني بالكامل",
    description:
      "لا اشتراكات ولا بطاقات بنكية ولا حدود مخفية. جميع الأدوات الخمس متاحة لك بلا مقابل، للأبد.",
    accent: "from-blue-500 to-indigo-600",
  },
  {
    icon: Gauge,
    title: "سريع جداً",
    description:
      "النتائج تظهر في ثوانٍ معدودة بفضل نموذج Llama 3 المستضاف على وحدات LPU من Groq، أسرع من أغلب الخدمات المشابهة.",
    accent: "from-purple-500 to-fuchsia-600",
  },
  {
    icon: Lock,
    title: "آمن وخاص",
    description:
      "لا نطلب تسجيلاً ولا نحتفظ بنصوصك؛ المعالجة تتم عبر واجهة مؤقتة ولا يتم تخزين محتوى النصوص إطلاقاً.",
    accent: "from-emerald-500 to-teal-600",
  },
];

const STEPS = [
  {
    number: "1",
    title: "اختر الأداة المناسبة",
    description: "خمس أدوات تغطي الاحتياجات اليومية للكتابة والمحتوى والتحليل.",
  },
  {
    number: "2",
    title: "الصق نصك أو موضوعك",
    description: "اكتب في الحقل المخصص أو استخدم زر «تجربة مثال» للبدء فوراً.",
  },
  {
    number: "3",
    title: "انسخ النتيجة أو حمّلها",
    description: "احصل على النتيجة في ثوانٍ، ثم انسخها أو حمّلها كملف نصي.",
  },
];

const FAQ = [
  {
    question: "هل المنصة مجانية فعلاً؟",
    answer:
      "نعم، جميع الأدوات الخمس مجانية بالكامل ولا تحتاج إلى تسجيل أو حساب. المشروع يعتمد على Groq المجاني كمحرك ذكاء اصطناعي، ويمكنك استضافته بنفسك على Vercel دون أي تكلفة.",
  },
  {
    question: "هل النصوص التي أكتبها محفوظة؟",
    answer:
      "لا يتم تخزين محتوى نصوصك. ما يُسجَّل في قاعدة البيانات هو أرقام إحصائية مجردة فقط (اسم الأداة، زمن الاستجابة، عدد الأحرف) لأغراض العرض في قسم الإحصائيات.",
  },
  {
    question: "ما محرك الذكاء الاصطناعي المستخدم؟",
    answer:
      "نستخدم نموذج Llama 3 عبر واجهة Groq المجانية (متوافقة مع OpenAI). وإذا لم يكن المفتاح مضبوطاً، تعمل الأدوات تلقائياً بمحرك تجريبي محلي حتى تتمكن من تجربة الواجهة كاملة.",
  },
  {
    question: "هل تدعم الأدوات اللغة العربية جيداً؟",
    answer:
      "نعم، الواجهة والتعليمات والمخرجات كلها مصممة للعربية أولاً (RTL)، وتم ضبط التعليمات المرسلة للنموذج لتنتج عربية فصيحة وواضحة.",
  },
];

export default async function HomePage() {
  const stats = await getUsageStats();
  const runsByTool = new Map(stats.perTool.map((item) => [item.tool, item.runs]));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    description: SITE.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: "ar",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: TOOLS.map((tool) => tool.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 sm:pb-16">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-purple-300" />
            5 أدوات ذكاء اصطناعي · مجانية 100% · بدون تسجيل
          </span>

          <h1
            className="animate-fade-up anim-delay-1 mx-auto mt-7 max-w-3xl text-4xl leading-[1.25] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.08s" }}
          >
            كل أدوات <span className="gradient-text">الذكاء الاصطناعي</span>
            <br />
            التي تحتاجها في مكان واحد
          </h1>

          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
            style={{ animationDelay: "0.16s" }}
          >
            ولّد نصوصاً احترافية، لخّص المستندات الطويلة، ترجم إلى 10 لغات، صحّح كتابتك،
            وحلّل مشاعر جمهورك — كل ذلك بالعربية، وفي ثوانٍ، ومجاناً بالكامل.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "0.24s" }}
          >
            <Link href="/tools/text-generator" className="btn-primary !px-7 !py-3.5 text-base">
              <Rocket className="h-5 w-5" />
              ابدأ الآن مجاناً
            </Link>
            <a href="#tools" className="btn-ghost !px-6 !py-3.5 text-base">
              <Globe2 className="h-4.5 w-4.5" />
              استعرض الأدوات
            </a>
          </div>

          <div
            className="animate-fade-up mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
            style={{ animationDelay: "0.32s" }}
          >
            {[
              { value: "5", label: "أدوات متخصصة" },
              { value: "10", label: "لغات للترجمة" },
              { value: "0", label: "ريال التكلفة" },
              { value: "3s", label: "متوسط الاستجابة" },
            ].map((item) => (
              <div key={item.label} className="glass-soft rounded-2xl px-4 py-4">
                <p className="text-2xl font-extrabold text-white">{item.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* هالات ضوئية */}
        <div className="animate-glow pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/30 blur-3xl" />
      </section>

      {/* ================= الأدوات ================= */}
      <section id="tools" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-slate-200">
            <Zap className="h-3.5 w-3.5 text-blue-300" />
            الأدوات
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            اختر الأداة وابدأ فوراً
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            كل أداة مبنية لنوع مختلف من المهام، وكلها تعمل بنفس البساطة: الصق النص، اضغط
            الزر، واحصل على النتيجة.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, index) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              index={index}
              runs={runsByTool.get(tool.slug) ?? 0}
            />
          ))}

          {/* بطاقة CTA السادسة */}
          <div className="glass-card animate-fade-up anim-delay-5 flex flex-col justify-center rounded-3xl bg-gradient-to-br from-blue-600/25 to-purple-700/25 p-7 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-7 w-7 text-white" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-white">جاهز للتجربة؟</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              لا حاجة لإنشاء حساب. اختر أداة وابدأ النتائج خلال ثوانٍ.
            </p>
            <Link
              href="/tools/summarizer"
              className="btn-primary mx-auto mt-6 !px-6"
            >
              جرّب ملخص النصوص
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= لماذا نحن ================= */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">لماذا نحن؟</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            ثلاثة أسباب تجعل AI Tools Hub الخيار الأسهل لأي عمل كتابي أو تحليلي.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ADVANTAGES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="glass-card group rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25"
              >
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-lg shadow-slate-950/40 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-white">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-slate-300/90">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= كيف تعمل ================= */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="glass-card rounded-3xl p-7 sm:p-10">
          <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl">
            كيف تعمل المنصة؟
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-extrabold text-white shadow-lg shadow-purple-900/40">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= الإحصائيات ================= */}
      <UsageStats stats={stats} />

      {/* ================= الأسئلة الشائعة ================= */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl">
          الأسئلة الشائعة
        </h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="glass-card group rounded-2xl px-5 py-4 transition-colors open:border-white/25"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-white">
                {item.question}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-base leading-none transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-blue-600/25 to-purple-700/25 p-8 text-center">
          <h3 className="text-2xl font-extrabold text-white">
            ابدأ الآن — لا تسجيل، لا تكلفة
          </h3>
          <p className="mx-auto mt-2.5 max-w-md text-sm leading-7 text-slate-300">
            اختر أداة، الصق نصك، واحصل على النتيجة خلال ثوانٍ.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="btn-ghost !px-4 !py-2.5 !text-xs"
              >
                <span>{tool.emoji}</span>
                {tool.shortName}
              </Link>
            ))}
          </div>
          <p className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-slate-400">
            <KeyRound className="h-3 w-3" />
            تعمل المنصة بمفتاح Groq مجاني يمكنك إنشاؤه من console.groq.com
          </p>
        </div>
      </section>
    </>
  );
}
