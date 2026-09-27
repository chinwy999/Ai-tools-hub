import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  FileText,
  Languages,
  ScrollText,
  Sparkles,
  Wand2,
} from "lucide-react";

export type ToolSlug =
  | "text-generator"
  | "summarizer"
  | "translator"
  | "writing-enhancer"
  | "sentiment";

export type ToolVariant = "text" | "points" | "revision" | "sentiment";

export type ToolDefinition = {
  slug: ToolSlug;
  endpoint: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: LucideIcon;
  emoji: string;
  variant: ToolVariant;
  accentFrom: string;
  accentTo: string;
  ring: string;
  chip: string;
  glow: string;
  inputLabel: string;
  inputPlaceholder: string;
  submitLabel: string;
  loadingLabel: string;
  minLength: number;
  maxLength: number;
  sample: string;
  features: string[];
  tips: string[];
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "text-generator",
    endpoint: "/api/generate-text",
    name: "مولد النصوص الاحترافية",
    shortName: "مولد النصوص",
    tagline: "حوّل فكرة واحدة إلى مقال كامل",
    description:
      "اكتب موضوعاً فقط، وسيولّد لك المساعد نصاً احترافياً منظّماً بمقدمة وعناصر وخاتمة جاهز للنشر.",
    seoTitle: "مولد النصوص بالذكاء الاصطناعي مجاناً",
    seoDescription:
      "أداة مجانية لتوليد نصوص ومقالات احترافية باللغة العربية من موضوع قصير، مدعومة بنموذج Llama 3 عبر Groq.",
    icon: FileText,
    emoji: "✍️",
    variant: "text",
    accentFrom: "from-blue-500",
    accentTo: "to-indigo-600",
    ring: "group-hover:ring-blue-400/60",
    chip: "bg-blue-500/15 text-blue-200 border-blue-400/30",
    glow: "bg-blue-500/25",
    inputLabel: "موضوع النص",
    inputPlaceholder: "مثال: فوائد تعلّم البرمجة في سن مبكرة",
    submitLabel: "توليد النص",
    loadingLabel: "جارٍ توليد النص...",
    minLength: 3,
    maxLength: 600,
    sample: "أهمية الذكاء الاصطناعي في تطوير التعليم الحديث",
    features: [
      "مقدمة جذابة وخاتمة موجزة",
      "عناوين فرعية منظمة",
      "أسلوب عربي فصيح وسهل",
    ],
    tips: [
      "كلما كان الموضوع أكثر تحديداً، كان النص أدق.",
      "يمكنك تحديد نوع النص المطلوب (مقال، منشور، بريد) من الحقل.",
    ],
  },
  {
    slug: "summarizer",
    endpoint: "/api/summarize",
    name: "ملخص النصوص الذكي",
    shortName: "ملخص النصوص",
    tagline: "نص طويل في 5 نقاط فقط",
    description:
      "الصق نصاً طويلاً أو مقالاً، وسيستخرج المساعد أهم الأفكار في نقاط رئيسية موجزة وواضحة.",
    seoTitle: "تلخيص النصوص العربية بالذكاء الاصطناعي مجاناً",
    seoDescription:
      "لخّص أي نص أو مقال طويل إلى 3-5 نقاط رئيسية دقيقة مجاناً، مع الحفاظ على المعنى الأصلي للنص.",
    icon: ScrollText,
    emoji: "📝",
    variant: "points",
    accentFrom: "from-purple-500",
    accentTo: "to-fuchsia-600",
    ring: "group-hover:ring-purple-400/60",
    chip: "bg-purple-500/15 text-purple-200 border-purple-400/30",
    glow: "bg-purple-500/25",
    inputLabel: "النص المطلوب تلخيصه",
    inputPlaceholder: "الصق هنا النص الطويل الذي تريد تلخيصه...",
    submitLabel: "تلخيص النص",
    loadingLabel: "جارٍ تلخيص النص...",
    minLength: 80,
    maxLength: 8000,
    sample:
      "يشهد العالم اليوم تحولاً رقمياً متسارعاً أثّر على جميع جوانب الحياة، من التعليم إلى الصحة والاقتصاد. فقد أصبحت البيانات هي المورد الأهم، والشركات التي تستطيع تحليلها والاستفادة منها تتفوق على منافسيها بسرعة مذهلة. وفي الوقت نفسه، يتيح الذكاء الاصطناعي أدوات كانت مستحيلة قبل سنوات قليلة، مثل الترجمة الفورية وتلخيص النصوص الضخمة في ثوانٍ. ومع ذلك، يبقى التحدي الأكبر هو الاستخدام المسؤول لهذه التقنيات، فالحماية من التحيز وصون خصوصية المستخدمين شرط أساسي لبناء الثقة. لذلك تحتاج المؤسسات إلى الاستثمار في تدريب فرقها ووضع سياسات واضحة قبل التوسع في تبني هذه الحلول.",
    features: [
      "3 إلى 5 نقاط رئيسية دقيقة",
      "يحافظ على المعنى الأصلي",
      "مثالي للمقالات والتقارير",
    ],
    tips: [
      "النصوص الأطول من 300 كلمة تعطي ملخصاً أدق.",
      "استخدم زر التحميل لحفظ الملخص كملف نصي.",
    ],
  },
  {
    slug: "translator",
    endpoint: "/api/translate",
    name: "الترجمة الفورية",
    shortName: "الترجمة الفورية",
    tagline: "10 لغات بترجمة طبيعية",
    description:
      "ترجم نصوصك بين العربية و10 لغات عالمية بأسلوب طبيعي يحافظ على المعنى والسياق.",
    seoTitle: "ترجمة فورية مجانية بين 10 لغات",
    seoDescription:
      "أداة ترجمة مجانية مدعومة بالذكاء الاصطناعي تدعم العربية والإنجليزية والفرنسية والإسبانية وأكثر بترجمة طبيعية.",
    icon: Languages,
    emoji: "🌍",
    variant: "text",
    accentFrom: "from-cyan-500",
    accentTo: "to-blue-600",
    ring: "group-hover:ring-cyan-400/60",
    chip: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
    glow: "bg-cyan-500/25",
    inputLabel: "النص المراد ترجمته",
    inputPlaceholder: "اكتب أو الصق النص الذي تريد ترجمته...",
    submitLabel: "ترجمة النص",
    loadingLabel: "جارٍ الترجمة...",
    minLength: 2,
    maxLength: 5000,
    sample: "التعلم المستمر هو المفتاح الحقيقي للنجاح في عالم التقنية.",
    features: [
      "10 لغات مدعومة بالكامل",
      "ترجمة تراعي السياق والمعنى",
      "نتائج فورية وسريعة",
    ],
    tips: [
      "اختر اللغة الهدف من القائمة المنسدلة قبل الترجمة.",
      "النصوص القصيرة تعطي ترجمة أكثر طبيعية.",
    ],
  },
  {
    slug: "writing-enhancer",
    endpoint: "/api/enhance-writing",
    name: "تحسين الكتابة",
    shortName: "تحسين الكتابة",
    tagline: "نص خالٍ من الأخطاء",
    description:
      "صحّح الأخطاء الإملائية والنحوية، وحسّن الأسلوب والوضوح، واحصل على نسخة احترافية من نصك.",
    seoTitle: "تصحيح وتحسين الكتابة العربية بالذكاء الاصطناعي",
    seoDescription:
      "أداة مجانية لتصحيح الأخطاء الإملائية والنحوية وتحسين أسلوب الكتابة العربية مع قائمة بالتحسينات المطبقة.",
    icon: Wand2,
    emoji: "🪄",
    variant: "revision",
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-600",
    ring: "group-hover:ring-emerald-400/60",
    chip: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    glow: "bg-emerald-500/25",
    inputLabel: "النص المطلوب تحسينه",
    inputPlaceholder: "الصق نصك هنا ليتم تصحيحه وتحسين أسلوبه...",
    submitLabel: "تحسين النص",
    loadingLabel: "جارٍ تحسين الكتابة...",
    minLength: 10,
    maxLength: 6000,
    sample:
      "الذكاء الاصطناعي من اهم التقنيات التى ظهرت فى السنين الاخيره , وهي بتساعد الشركات كثير فى تحسين الخدمات وتسريع العمل",
    features: [
      "تصحيح إملائي ونحوي دقيق",
      "تحسين الأسلوب والوضوح",
      "قائمة بأهم التحسينات",
    ],
    tips: [
      "ستجد قائمة بأبرز التحسينات أسفل النتيجة.",
      "احتفظ بالنص الأصلي قبل المقارنة بين النسختين.",
    ],
  },
  {
    slug: "sentiment",
    endpoint: "/api/analyze-sentiment",
    name: "تحليل المشاعر",
    shortName: "تحليل المشاعر",
    tagline: "اعرف رأي جمهورك بدقة",
    description:
      "حلّل أي نص أو تعليق أو مراجعة لتعرف إن كان إيجابياً أو سلبياً أو محايداً، مع نسبة ثقة وتفاصيل واضحة.",
    seoTitle: "تحليل المشاعر والنصوص مجاناً بالعربية",
    seoDescription:
      "أداة تحليل مشاعر مجانية تصنف النصوص العربية والإنجليزية إلى إيجابي أو سلبي أو محايد مع نسبة ثقة وكلمات مفتاحية.",
    icon: BarChart3,
    emoji: "💬",
    variant: "sentiment",
    accentFrom: "from-orange-500",
    accentTo: "to-rose-600",
    ring: "group-hover:ring-orange-400/60",
    chip: "bg-orange-500/15 text-orange-200 border-orange-400/30",
    glow: "bg-orange-500/25",
    inputLabel: "النص المطلوب تحليله",
    inputPlaceholder: "الصق تعليقاً أو مراجعة أو رسالة لتحليل مشاعرها...",
    submitLabel: "تحليل النص",
    loadingLabel: "جارٍ تحليل المشاعر...",
    minLength: 5,
    maxLength: 4000,
    sample:
      "الخدمة كانت ممتازة وسريعة جداً، الدعم الفني تعامل معي باحترام وساعدني في حل المشكلة خلال دقائق. شكراً جزيلاً لكم!",
    features: [
      "تصنيف: إيجابي / سلبي / محايد",
      "نسبة ثقة واضحة ومفصلة",
      "استخراج الكلمات المؤثرة",
    ],
    tips: [
      "مناسب لتحليل تعليقات العملاء والمراجعات.",
      "النصوص الأطول تعطي تصنيفاً أكثر دقة.",
    ],
  },
];

export function getTool(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export const LANGUAGES = [
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "en", name: "الإنجليزية", flag: "🇬🇧" },
  { code: "fr", name: "الفرنسية", flag: "🇫🇷" },
  { code: "es", name: "الإسبانية", flag: "🇪🇸" },
  { code: "de", name: "الألمانية", flag: "🇩🇪" },
  { code: "tr", name: "التركية", flag: "🇹🇷" },
  { code: "ur", name: "الأردية", flag: "🇵🇰" },
  { code: "hi", name: "الهندية", flag: "🇮🇳" },
  { code: "zh", name: "الصينية", flag: "🇨🇳" },
  { code: "ru", name: "الروسية", flag: "🇷🇺" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function languageName(code: string): string {
  return LANGUAGES.find((lang) => lang.code === code)?.name ?? code;
}

export const SITE = {
  name: "AI Tools Hub",
  nameAr: "مركز أدوات الذكاء الاصطناعي",
  description:
    "منصة عربية مجانية بالكامل تجمع 5 أدوات ذكاء اصطناعي: توليد النصوص، تلخيص النصوص، الترجمة الفورية، تحسين الكتابة، وتحليل المشاعر.",
  url: "https://ai-tools-hub-six-sage.vercel.app",
};
