/**
 * محرك تجريبي محلي (بدون إنترنت).
 * يُستخدم تلقائياً عندما لا يكون GROQ_API_KEY مضبوطاً، أو عند فشل الخدمة،
 * حتى تبقى جميع الأدوات تعمل دائماً. النتائج أبسط من نموذج Llama 3
 * لكنها حقيقية ومفيدة.
 */

import { languageName } from "./tools";

/* ------------------------------------------------------------------ */
/*  1) مولد النصوص                                                     */
/* ------------------------------------------------------------------ */

export function demoGenerateText(topic: string): string {
  const clean = topic.trim().replace(/\s+/g, " ");
  const title = clean.charAt(0).toUpperCase() + clean.slice(1);

  return `# ${title}

## مقدمة
يُعدّ موضوع «${clean}» من المواضيع التي تفرض نفسها على أي نقاش جدي حول التطوير والتحسين في عصرنا الحالي. فالتغيرات المتسارعة في التقنية وسوق العمل جعلت فهم هذا الموضوع ضرورة عملية لا رفاهية فكرية، خصوصاً للأفراد والمؤسسات التي تسعى للحفاظ على موطئ قدمها وتحقيق نتائج ملموسة في وقت قصير.

## لماذا يهم «${clean}»؟
- **توفير الوقت والجهد:** التعامل الواعي مع هذا الموضوع يقليل التجربة والخطأ ويختصر الطريق نحو الهدف.
- **رفع جودة المخرجات:** حين تُبنى القرارات على فهم واضح تتحسن النتائج كمّاً ونوعاً.
- **ميزة تنافسية:** من يتقن التفاصيل يسبق غيره ويستقطب الفرص قبل الجميع.
- **قابلية التوسع:** ما يُبنى على أسس صحيحة يمكن تطويره لاحقاً دون إعادة بناء.

## خطوات عملية للبدء
1. **حدّد الهدف بدقة:** اكتب النتيجة التي تريدها في سطر واحد واضح وقابل للقياس.
2. **اجمع المعلومات من مصادر موثوقة:** القراءة المتعمقة أهم من الكم الهائل من المصادر.
3. **ابدأ بأصغر تجربة ممكنة:** نفّذ مشروعاً صغيراً لتختبر فهمك على أرض الواقع.
4. **قِس النتائج وحسّنها:** راجع ما نجح وما فشل، ثم كرر الدورة كل أسبوع.
5. **شارك ما تتعلمه:** النشر والمناقشة يثبّتان المعرفة ويوسعان شبكة علاقاتك.

## تحديات شائعة وكيف تتغلب عليها
أكبر عقبة أمام معظم الأشخاص هي التشتت بين المصادر وطرق العمل المختلفة. الحل أن تختار مساراً واحداً وتلتزم به لمدة كافية قبل الحكم عليه. والتحدي الثاني هو ضغط الوقت، ويعالَج بتخصيص وقت ثابت يومياً ولو كان قصيراً، فالاستمرارية أقوى من الحماسة المؤقتة.

## خاتمة
«${clean}» ليس موضوعاً نظرياً يُقرأ ثم يُنسى، بل مهارة تُبنى بالتطبيق المتكرر والمراجعة الصادقة. ابدأ اليوم بخطوة صغيرة، وقِس أثرها بعد أسبوع، وستجد نفسك بعد شهور في نقطة لم تكن متاحة في أفقك سابقاً.
`;
}

/* ------------------------------------------------------------------ */
/*  2) ملخص النصوص (تلخيص استخلاصي)                                    */
/* ------------------------------------------------------------------ */

const AR_STOPWORDS = new Set([
  "في","من","على","إلى","عن","أن","إن","كان","كانت","ما","لا","لم","لن","هذا","هذه","ذلك","التي","الذي","أو","و","ثم","كما","بعد","قبل","بين","مع","كل","بعض","هو","هي","هم","نحن","أنت","أنا","قد","لقد","حتى","إذا","لكن","أي","هناك","يكون","تكون","عند","لدى","غير","نحو","ضمن","خلال","أثناء","به","بها","له","لها","منه","منها","فيه","فيها","التى","الذى","أيضا","أيضاً","جدا","جداً","حيث","لكي","كي","إذ","وهو","وهي",
]);

const EN_STOPWORDS = new Set([
  "the","a","an","and","or","but","if","then","than","that","this","these","those","is","are","was","were","be","been","being","to","of","in","on","for","with","as","by","at","from","it","its","they","them","their","we","our","you","your","he","she","his","her","not","no","do","does","did","have","has","had","will","would","can","could","should","about","into","over","after","before","more","most","also","very","just",
]);

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?؟…])\s+|(?<=\n)/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function demoSummarize(text: string, count = 5): string[] {
  const sentences = splitSentences(text);
  if (sentences.length <= count) {
    return sentences.map((s) => s.replace(/\s+/g, " ").trim());
  }

  const frequencies = new Map<string, number>();
  for (const word of tokenize(text)) {
    if (AR_STOPWORDS.has(word) || EN_STOPWORDS.has(word) || word.length < 3) continue;
    frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
  }

  const scored = sentences.map((sentence, index) => {
    const words = tokenize(sentence);
    const meaningful = words.filter(
      (w) => !AR_STOPWORDS.has(w) && !EN_STOPWORDS.has(w) && w.length >= 3,
    );
    const raw = meaningful.reduce((sum, w) => sum + (frequencies.get(w) ?? 0), 0);
    const lengthPenalty = Math.sqrt(Math.max(meaningful.length, 1));
    // وزن إضافي للجمل الافتتاحية لأنها تحمل الفكرة الأساسية غالباً
    const positionBonus = index === 0 ? 1.25 : index < 3 ? 1.08 : 1;
    return { sentence, index, score: (raw / lengthPenalty) * positionBonus };
  });

  return scored
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((item) => {
      let sentence = item.sentence.replace(/\s+/g, " ").trim();
      if (sentence.length > 240) sentence = `${sentence.slice(0, 237).trimEnd()}…`;
      return sentence;
    });
}

/* ------------------------------------------------------------------ */
/*  3) الترجمة (قاموس مبسّط عربي ⇄ إنجليزي)                            */
/* ------------------------------------------------------------------ */

const GLOSSARY: Record<string, string> = {
  "التعلم": "learning",
  "تعلم": "learning",
  "المستمر": "continuous",
  "مستمر": "continuous",
  "هو": "is",
  "هي": "is",
  "المفتاح": "the key",
  "مفتاح": "key",
  "الحقيقي": "real",
  "حقيقي": "real",
  "للنجاح": "for success",
  "النجاح": "success",
  "نجاح": "success",
  "في": "in",
  "عالم": "world",
  "العالم": "the world",
  "التقنية": "technology",
  "تقنية": "technology",
  "الذكاء": "intelligence",
  "الاصطناعي": "artificial",
  "المستقبل": "the future",
  "مستقبل": "future",
  "البيانات": "data",
  "بيانات": "data",
  "الشركات": "companies",
  "شركة": "company",
  "العمل": "work",
  "يعمل": "works",
  "الناس": "people",
  "الوقت": "time",
  "وقت": "time",
  "سريع": "fast",
  "سريعة": "fast",
  "جدا": "very",
  "جداً": "very",
  "شكرا": "thank you",
  "شكراً": "thank you",
  "جزيل": "a lot",
  "الكتابة": "writing",
  "كتابة": "writing",
  "النص": "text",
  "نص": "text",
  "الترجمة": "translation",
  "ترجمة": "translation",
  "اللغة": "language",
  "لغة": "language",
  "العربية": "Arabic",
  "الإنجليزية": "English",
  "ممتاز": "excellent",
  "ممتازة": "excellent",
  "خدمة": "service",
  "الخدمة": "the service",
  "الدعم": "support",
  "الفني": "technical",
  "احترافي": "professional",
  "مساعدة": "help",
  "يساعد": "helps",
  "مشكلة": "problem",
  "المشكلة": "the problem",
  "الحل": "the solution",
  "حل": "solution",
  "المشروع": "the project",
  "مشروع": "project",
  "التطوير": "development",
  "تطوير": "development",
  "التعليم": "education",
  "تعليم": "education",
  "الطالب": "the student",
  "طالب": "student",
  "المعلم": "the teacher",
  "مجاني": "free",
  "مجانية": "free",
  "أداة": "tool",
  "أدوات": "tools",
  "جديد": "new",
  "جديدة": "new",
  "أفضل": "better",
  "جيد": "good",
  "جيدة": "good",
  "سيئ": "bad",
  "سيئة": "bad",
  "الكبير": "big",
  "الصغير": "small",
  "اليوم": "today",
  "غدا": "tomorrow",
  "الأمور": "things",
  "الحياة": "life",
  "العالمية": "global",
  "مهم": "important",
  "مهمة": "important",
  "المهم": "the important",
};

const REVERSE_GLOSSARY: Record<string, string> = Object.entries(GLOSSARY).reduce(
  (acc, [ar, en]) => {
    if (!acc[en]) acc[en] = ar;
    return acc;
  },
  {} as Record<string, string>,
);

export type DemoTranslation = { text: string; supported: boolean };

export function demoTranslate(
  text: string,
  target: string,
  source: string,
): DemoTranslation {
  const sourceIsArabic = /[\u0600-\u06FF]/.test(text);
  const useArToEn =
    target === "en" && (source === "auto" ? sourceIsArabic : source === "ar");
  const useEnToAr =
    target === "ar" && (source === "auto" ? !sourceIsArabic : source === "en");

  if (!useArToEn && !useEnToAr) {
    return {
      supported: false,
      text:
        `الترجمة إلى «${languageName(target)}» غير متاحة في الوضع التجريبي المحلي.\n\n` +
        "الوضع التجريبي يدعم الترجمة الحرفية بين العربية والإنجليزية فقط.\n" +
        "أضف مفتاح GROQ_API_KEY في ملف .env.local لتشغيل الترجمة الكاملة عبر نموذج Llama 3 إلى جميع اللغات العشر.",
    };
  }

  const dictionary = useArToEn ? GLOSSARY : REVERSE_GLOSSARY;
  const translated = text
    .split(/(\s+|[.,!?;:،؛؟…()"'«»\-])/u)
    .map((token) => {
      if (!token.trim()) return token;
      if (!/[\p{L}]/u.test(token)) return token;
      const direct = dictionary[token];
      if (direct) return direct;
      const stripped = token.replace(/^(ال|وال|بال|فال|كال|لل)/, "");
      const alt = dictionary[stripped];
      if (alt) return alt;
      const lower = token.toLowerCase();
      return dictionary[lower] ?? token;
    })
    .join("")
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    supported: true,
    text:
      translated +
      "\n\n— ملاحظة: هذه ترجمة حرفية من الوضع التجريبي المحلي. أضف GROQ_API_KEY للحصول على ترجمة طبيعية تراعي السياق.",
  };
}

/* ------------------------------------------------------------------ */
/*  4) تحسين الكتابة (قواعد لغوية)                                     */
/* ------------------------------------------------------------------ */

const SPELLING_FIXES: Record<string, string> = {
  "الذى": "الذي",
  "التى": "التي",
  "الذين": "الذين",
  "هاذا": "هذا",
  "هاذه": "هذه",
  "لاكن": "لكن",
  "لكي": "لكي",
  "انشاء الله": "إن شاء الله",
  "ان شاء الله": "إن شاء الله",
  "اهلا": "أهلاً",
  "اهلاً": "أهلاً",
  "شكرا": "شكراً",
  "جدا": "جداً",
  "تماما": "تماماً",
  "دائما": "دائماً",
  "ابدا": "أبدًا",
  "انا": "أنا",
  "انت": "أنت",
  "ان": "أن",
  "او": "أو",
  "اذا": "إذا",
  "ايضا": "أيضاً",
  "اهم": "أهم",
  "من اهم": "من أهم",
  "فى": "في",
  "الذكى": "الذكي",
  "الاصطناعى": "الاصطناعي",
  "وهى": "وهي",
  "هى": "هي",
  "الاخيره": "الأخيرة",
  "الاخيرة": "الأخيرة",
  "التقنيات التى": "التقنيات التي",
  "فيع": "في",
  "علي": "على",
  "الي": "إلى",
  "السنين": "السنوات",
  "بتساعد": "تساعد",
  "كثير": "كثيراً",
  "مشكله": "مشكلة",
  "فكره": "فكرة",
  "برنامج": "برنامج",
  "خدمه": "خدمة",
  "ممكن": "من الممكن",
};

export type DemoRevision = { text: string; changes: string[] };

export function demoEnhanceWriting(input: string): DemoRevision {
  const changes: string[] = [];
  let text = input;

  const beforeWhitespace = text;
  text = text.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  if (text !== beforeWhitespace) {
    changes.push("تنظيف المسافات الزائدة والأسطر الفارغة المكررة.");
  }

  const beforePunct = text;
  text = text
    .replace(/\s+([،,.!؟?;:])/g, "$1")
    .replace(/([،,;:])(?=\S)/g, "$1 ")
    .replace(/([.!?؟])(?=[\p{L}])/gu, "$1 ")
    .replace(/([؟!]){2,}/g, "$1");
  if (text !== beforePunct) {
    changes.push("تصحيح المسافات حول علامات الترقيم.");
  }

  let spellingCount = 0;
  for (const [wrong, right] of Object.entries(SPELLING_FIXES)) {
    const pattern = new RegExp(`(^|[\\s،,.!؟?;:«»()])${wrong}($|[\\s،,.!؟?;:«»()])`, "gu");
    text = text.replace(pattern, (_match, pre: string, post: string) => `${pre}${right}${post}`);
    spellingCount += 1;
  }
  changes.push("مراجعة إملائية لقائمة أشهر الأخطاء الشائعة في الكتابة العربية.");

  const beforeRepeated = text;
  text = text.replace(/([\p{L}])\1{2,}/gu, "$1$1");
  if (text !== beforeRepeated) {
    changes.push("حذف التكرار غير المقصود في الحروف (مثل: جدااا → جداً).");
  }

  const beforeEnd = text;
  text = text.replace(/\s+$/, "");
  if (!/[.!?؟…:"')\]]$/.test(text)) {
    text = `${text}.`;
  }
  if (text !== beforeEnd) changes.push("إضافة علامة ترقيم في نهاية النص.");

  const beforeLatin = text;
  text = text
    .replace(/(^|[.!?]\s+)([a-z])/g, (_m, pre: string, letter: string) => pre + letter.toUpperCase())
    .replace(/(^|\s)i(\s|,|'|$)/g, (_m, pre: string, post: string) => `${pre}I${post}`);
  if (text !== beforeLatin) changes.push("تصحيح حالة الأحرف في الكلمات الإنجليزية.");

  const beforeVerbs = text;
  text = text
    .replace(/\bان شاء الله\b/g, "إن شاء الله")
    .replace(/\bالحمد لله\b/g, "الحمد لله");
  if (text !== beforeVerbs) changes.push("توحيد كتابة العبارات الشائعة.");

  if (changes.length === 0) {
    changes.push("النص الأصلي سليم لغوياً إلى حد كبير، وتم تحسين الانسيابية فقط.");
  }

  return { text, changes: Array.from(new Set(changes)).slice(0, 8) };
}

/* ------------------------------------------------------------------ */
/*  5) تحليل المشاعر (قاموس عاطفي)                                     */
/* ------------------------------------------------------------------ */

const POSITIVE_WORDS: Record<string, number> = {
  "ممتاز": 3,"ممتازة": 3,"رائع": 3,"رائعة": 3,"جميل": 2,"جميلة": 2,"جيد": 2,"جيدة": 2,"أفضل": 3,"افضل": 3,
  "مذهل": 3,"مبهر": 3,"مبهره": 3,"سعيد": 3,"سعيدة": 3,"سعيدا": 3,"محب": 2,"أحب": 3,"احب": 3,"يعجبني": 3,
  "تعجبني": 3,"ممتن": 3,"ممتنه": 3,"شكرا": 2,"شكراً": 2,"مشكور": 2,"مفيد": 3,"مفيدة": 3,"سهل": 2,"سهلة": 2,
  "سريع": 2,"سريعة": 2,"ناجح": 3,"ناجحة": 3,"موفق": 3,"مبتكر": 3,"لطيف": 2,"لطيفة": 2,"ودود": 2,"محترم": 2,
  "احترافي": 3,"احترافية": 3,"نظيف": 2,"مرتب": 2,"مريح": 2,"مريحة": 2,"مميز": 3,"مميزة": 3,"مبتسم": 2,
  "أثق": 3,"موثوق": 3,"ناجعه": 3,"مساعدة": 2,"ساعدني": 3,"مبسط": 2,"واضح": 2,"واضحة": 2,"مفهوم": 2,
  "good": 2,"great": 3,"excellent": 3,"amazing": 3,"awesome": 3,"love": 3,"like": 2,"happy": 3,"best": 3,
  "perfect": 3,"thanks": 2,"thank": 2,"helpful": 3,"fast": 2,"professional": 3,"wonderful": 3,"nice": 2,
};

const NEGATIVE_WORDS: Record<string, number> = {
  "سيئ": 3,"سيئة": 3,"سيئه": 3,"رديء": 3,"رديئة": 3,"ممل": 3,"مملة": 3,"بطيء": 2,"بطيئة": 2,"غالي": 2,
  "غالية": 2,"مشكلة": 2,"مشاكل": 2,"خطأ": 2,"أخطاء": 2,"اخطاء": 2,"فشل": 3,"فاشل": 3,"حزين": 3,"حزينة": 3,
  "أكره": 3,"اكره": 3,"مزعج": 3,"مزعجة": 3,"صعب": 2,"صعبة": 2,"معقد": 2,"معقدة": 2,"خاسر": 3,"تأخير": 2,
  "تاخر": 2,"مخيب": 3,"محبط": 3,"محبطة": 3,"غير محترم": 3,"ضعيف": 3,"ضعيفة": 3,"مرتبك": 2,"غاضب": 3,
  "غضب": 3,"انزعاج": 3,"استغرب": 2,"كارثة": 3,"مصيبة": 3,"انتظار": 1,"متعب": 2,"مكسور": 2,"لا يعمل": 3,
  "bad": 3,"terrible": 3,"awful": 3,"worst": 3,"hate": 3,"angry": 3,"sad": 3,"slow": 2,"expensive": 2,
  "problem": 2,"broken": 3,"bug": 2,"disappointed": 3,"poor": 3,"useless": 3,"hard": 2,"worst-ever": 3,
};

const NEGATIONS = new Set(["لا","ليس","لم","لن","بدون","غير","ما","لاَ","never","not","no","without"]);
const INTENSIFIERS = new Set(["جداً","جدا","كثيراً","كثير","للغاية","الغاية","تماماً","تماما","very","really","extremely"]);

export type SentimentResult = {
  label: "إيجابي" | "سلبي" | "محايد";
  labelKey: "positive" | "negative" | "neutral";
  confidence: number;
  scores: { positive: number; negative: number; neutral: number };
  keywords: string[];
  explanation: string;
};

export function demoSentiment(text: string): SentimentResult {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  let positive = 0;
  let negative = 0;
  const found: { word: string; polarity: 1 | -1; weight: number }[] = [];

  words.forEach((word, index) => {
    const entry =
      POSITIVE_WORDS[word] !== undefined
        ? { polarity: 1 as const, weight: POSITIVE_WORDS[word]! }
        : NEGATIVE_WORDS[word] !== undefined
          ? { polarity: -1 as const, weight: NEGATIVE_WORDS[word]! }
          : null;
    if (!entry) return;

    let weight = entry.weight;
    const previous = words[index - 1] ?? "";
    const before = words[index - 2] ?? "";
    const negated = NEGATIONS.has(previous) || NEGATIONS.has(before);
    const intensified = INTENSIFIERS.has(words[index + 1] ?? "");

    if (intensified) weight = Math.round(weight * 1.4);
    if (negated) {
      weight = Math.max(1, Math.round(weight * 0.85));
      found.push({
        word: negated ? `${previous} ${word}` : word,
        polarity: entry.polarity === 1 ? -1 : 1,
        weight,
      });
      if (entry.polarity === 1) negative += weight;
      else positive += weight;
      return;
    }

    found.push({ word, polarity: entry.polarity, weight });
    if (entry.polarity === 1) positive += weight;
    else negative += weight;
  });

  const total = positive + negative;
  const exclamation = (text.match(/[!]/g) ?? []).length;
  if (exclamation > 0 && total > 0) {
    if (positive >= negative) positive += exclamation * 0.6;
    else negative += exclamation * 0.6;
  }

  let positiveShare = 0;
  let negativeShare = 0;
  let neutralShare = 0;

  if (total === 0) {
    positiveShare = 18;
    negativeShare = 18;
    neutralShare = 64;
  } else {
    const positiveRatio = positive / total;
    const gap = Math.abs(positiveRatio - 0.5);
    neutralShare = Math.max(6, 42 - gap * 74);
    const rest = 100 - neutralShare;
    positiveShare = rest * positiveRatio;
    negativeShare = rest - positiveShare;
  }

  const sum = positiveShare + negativeShare + neutralShare;
  const scores = {
    positive: Math.round((positiveShare / sum) * 100),
    negative: Math.round((negativeShare / sum) * 100),
    neutral: Math.round((neutralShare / sum) * 100),
  };

  const entries: [SentimentResult["labelKey"], number][] = [
    ["positive", scores.positive],
    ["negative", scores.negative],
    ["neutral", scores.neutral],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const [topKey, topScore] = entries[0]!;

  const label: SentimentResult["label"] =
    topKey === "positive" ? "إيجابي" : topKey === "negative" ? "سلبي" : "محايد";

  const confidence = Math.min(97, Math.max(46, Math.round(topScore)));

  const keywords = Array.from(
    new Map(found.map((item) => [item.word, item])).values(),
  )
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6)
    .map((item) => item.word);

  const parts: string[] = [];
  if (keywords.length > 0) {
    parts.push(`رصد المحرك الكلمات الدالة التالية: ${keywords.join("، ")}.`);
  } else {
    parts.push("لم يجد المحرك كلمات عاطفية صريحة في النص.");
  }
  if (found.some((item) => item.word.includes(" "))) {
    parts.push("تم أخذ أدوات النفي في الاعتبار عند حساب النتيجة.");
  }
  parts.push(
    topKey === "neutral"
      ? "النص يغلب عليه الطابع الوصفي أو المعلوماتي، لذلك تم تصنيفه محايداً."
      : `ترجّح النتيجة نحو الطرف ${label} بنسبة ${confidence}% بعد موازنة الكلمات الموجبة والسالبة.`,
  );

  return {
    label,
    labelKey: topKey,
    confidence,
    scores,
    keywords,
    explanation: parts.join(" "),
  };
}
