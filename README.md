# 🚀 AI Tools Hub — منصة أدوات الذكاء الاصطناعي المجانية

منصة عربية (RTL) تجمع **5 أدوات ذكاء اصطناعي مجانية بالكامل** في مكان واحد، مبنية بـ
**Next.js (App Router) + TypeScript + Tailwind CSS**، ومتصلة بنموذج **Llama 3** عبر
واجهة **Groq** المجانية.

| # | الأداة | المسار | واجهة الـ API |
|---|--------|--------|----------------|
| 1 | مولد النصوص الاحترافية | `/tools/text-generator` | `POST /api/generate-text` |
| 2 | ملخص النصوص الذكي | `/tools/summarizer` | `POST /api/summarize` |
| 3 | الترجمة الفورية (10 لغات) | `/tools/translator` | `POST /api/translate` |
| 4 | تحسين الكتابة | `/tools/writing-enhancer` | `POST /api/enhance-writing` |
| 5 | تحليل المشاعر | `/tools/sentiment` | `POST /api/analyze-sentiment` |

---

## ✨ المميزات

- واجهة عربية كاملة من اليمين إلى اليسار (RTL) بخط **Cairo / Tajawal**.
- تصميم عصري: خلفية متدرجة داكنة، بطاقات **Glassmorphism**، أنيميشن ناعمة، تجاوب كامل (Mobile-first).
- 5 أدوات جاهزة، كل أداة بصفحة مستقلة + API Route مستقل + عنوان ووصف SEO خاص بها.
- أزرار: **نسخ النتيجة**، **تحميل كملف نصي `.txt`**، **مسح الحقول**، و**تجربة مثال**.
- حالات تحميل واضحة (Spinner + Skeleton) ورسائل خطأ عربية مفهومة.
- **حد للطلبات (Rate limiting)** لكل IP لمنع إساءة الاستخدام.
- **إحصائيات استخدام حية** مخزّنة في PostgreSQL عبر Drizzle ORM (`/api/stats`).
- **وضع تجريبي محلي**: إن لم يوجد مفتاح Groq، تعمل كل الأدوات بمحرك محلي (قواعد لغوية
  + تلخيص استخلاصي + تحليل مشاعر بقاموس) حتى تبقى المنصة قابلة للتشغيل والتجربة دائماً.
- لا توجد أي مكتبات أو خدمات مدفوعة.

---

## 🧰 المتطلبات

- Node.js 20 أو أحدث
- npm 10 أو أحدث
- (اختياري) PostgreSQL لتسجيل الإحصائيات
- (اختياري) مفتاح Groq مجاني

---

## ⚡ التثبيت والتشغيل

```bash
# 1) تثبيت الحزم
npm install

# 2) إعداد متغيرات البيئة
cp .env.local.example .env.local
# ثم افتح .env.local وضع مفتاح GROQ_API_KEY الخاص بك

# 3) (اختياري) إنشاء جداول قاعدة البيانات للإحصائيات
npx drizzle-kit push

# 4) تشغيل وضع التطوير
npm run dev
```

افتح المتصفح على: <http://localhost:3000>

للنشر الإنتاجي:

```bash
npm run build
npm run start
```

---

## 🔑 كيف تحصل على مفتاح Groq المجاني؟

1. افتح <https://console.groq.com> وأنشئ حساباً مجانياً (يمكن الدخول بحساب Google).
2. من القائمة الجانبية اختر **API Keys** أو انتقل مباشرة إلى
   <https://console.groq.com/keys>.
3. اضغط **Create API Key**، أعطِ المفتاح اسماً مثل `ai-tools-hub`، ثم انسخ المفتاح
   (يبدأ عادة بـ `gsk_...`).
4. الصق المفتاح في ملف `.env.local`:

   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. أعد تشغيل سيرفر التطوير (`npm run dev`)، وستتحول كل الأدوات تلقائياً إلى محرك
   Llama 3 الكامل (ستلاحظ شارة «Llama 3» في أعلى منطقة النتيجة).

> الخطة المجانية من Groq كافية جداً للاستخدام الشخصي (آلاف الطلبات يومياً).
> إذا أوقفت Groq نموذجاً قديماً مثل `llama3-70b-8192`، سيجرب التطبيق تلقائياً نماذج
> بديلة مثل `llama-3.3-70b-versatile` و`llama-3.1-8b-instant`.

---

## 🔐 متغيرات البيئة

| المتغير | مطلوب؟ | الوصف |
|---------|--------|-------|
| `GROQ_API_KEY` | مطلوب للتشغيل الكامل | مفتاح Groq المجاني. بدونه تعمل الأدوات بالمحرك التجريبي المحلي |
| `GROQ_MODEL` | اختياري | النموذج المستخدم (الافتراضي `llama-3.3-70b-versatile`) |
| `RATE_LIMIT` | اختياري | عدد الطلبات المسموح بها لكل IP في الدقيقة (الافتراضي 12) |
| `RATE_LIMIT_WINDOW_MS` | اختياري | مدة نافذة حد الطلبات بالمللي ثانية (الافتراضي 60000) |
| `DATABASE_URL` | اختياري | رابط PostgreSQL لتسجيل إحصائيات الاستخدام |
| `NEXT_PUBLIC_*` | — | لا يوجد أي متغير عام؛ كل المفاتيح تبقى على السيرفر |

---

## 🗂️ هيكل المشروع

```
src/
├─ app/
│  ├─ layout.tsx                     # التخطيط العام (RTL + الخطوط + Navbar/Footer + SEO)
│  ├─ page.tsx                       # الصفحة الرئيسية (Hero + الأدوات + المميزات + الإحصائيات + FAQ)
│  ├─ globals.css                    # نظام التصميم (تدرجات، Glassmorphism، أنيميشن)
│  ├─ sitemap.ts / robots.ts         # SEO
│  ├─ not-found.tsx                  # صفحة 404 عربية
│  ├─ tools/
│  │  ├─ text-generator/page.tsx
│  │  ├─ summarizer/page.tsx
│  │  ├─ translator/page.tsx
│  │  ├─ writing-enhancer/page.tsx
│  │  └─ sentiment/page.tsx
│  └─ api/
│     ├─ generate-text/route.ts
│     ├─ summarize/route.ts
│     ├─ translate/route.ts
│     ├─ enhance-writing/route.ts
│     ├─ analyze-sentiment/route.ts
│     ├─ stats/route.ts
│     └─ health/route.ts
├─ components/
│  ├─ Navbar.tsx        # شريط تنقل لاصق + قائمة جوال
│  ├─ Footer.tsx        # تذييل بمعلومات الموقع
│  ├─ ToolCard.tsx      # بطاقة أداة في الرئيسية
│  ├─ ToolPageShell.tsx # ترويسة صفحة الأداة + النصائح + الأدوات المشابهة
│  ├─ ToolWorkspace.tsx # منطقة الإدخال/النتيجة + النسخ والتحميل والمسح
│  ├─ LoadingSpinner.tsx
│  └─ UsageStats.tsx    # إحصائيات حية
├─ lib/
│  ├─ tools.ts          # سجل الأدوات واللغات (مصدر واحد للحقيقة)
│  ├─ groq.ts           # عميل Groq مع تبديل تلقائي بين النماذج
│  ├─ demo-engine.ts    # محرك تجريبي محلي (يعمل بدون مفتاح)
│  ├─ ai.ts             # طبقة موحدة: تحقق + حد طلبات + تنفيذ + تسجيل
│  ├─ rate-limit.ts
│  └─ stats.ts
└─ db/
   ├─ schema.ts         # جدول tool_runs
   └─ index.ts          # عميل Drizzle
```

---

## 🔌 أمثلة على استخدام الـ API

كل المسارات تستقبل `POST` مع `Content-Type: application/json`.

```bash
# توليد نص
curl -X POST http://localhost:3000/api/generate-text \
  -H "Content-Type: application/json" \
  -d '{"topic":"أهمية الذكاء الاصطناعي في التعليم"}'

# تلخيص
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" -d '{"text":"نص طويل هنا ..."}'

# ترجمة إلى الإنجليزية
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"مرحبا بالعالم","target":"en","source":"auto"}'

# تحسين الكتابة
curl -X POST http://localhost:3000/api/enhance-writing \
  -H "Content-Type: application/json" -d '{"text":"الذكى الاصطناعى من اهم التقنيات"}'

# تحليل المشاعر
curl -X POST http://localhost:3000/api/analyze-sentiment \
  -H "Content-Type: application/json" -d '{"text":"الخدمة ممتازة وسريعة جداً"}'

# إحصائيات الاستخدام
curl http://localhost:3000/api/stats
```

شكل الاستجابة الناجحة:

```json
{
  "ok": true,
  "tool": "summarizer",
  "result": { "points": ["...", "..."] },
  "meta": { "engine": "groq", "model": "llama-3.3-70b-versatile", "elapsedMs": 812, "notice": null }
}
```

شكل الاستجابة عند الخطأ (دائماً برسالة عربية):

```json
{ "ok": false, "error": "النص قصير جداً. يرجى إدخال 80 حرفاً على الأقل." }
```

رموز الحالة: `400` مدخلات ناقصة · `413` نص طويل · `429` تجاوز حد الطلبات ·
`401/503` مشكلة في المفتاح · `500` خطأ غير متوقع.

---

## ☁️ النشر المجاني على Vercel

1. ارفع المشروع إلى مستودع على **GitHub**.
2. افتح <https://vercel.com> وسجّل الدخول بحساب GitHub (مجاني).
3. اضغط **Add New → Project** ثم اختر المستودع.
4. سيكتشف Vercel أنه مشروع Next.js تلقائياً — لا تغيّر أي إعداد في البناء.
5. في قسم **Environment Variables** أضف:
   - `GROQ_API_KEY` = مفتاحك من console.groq.com
   - `DATABASE_URL` = (اختياري) رابط PostgreSQL مجاني من Neon أو Supabase
6. اضغط **Deploy**. بعد ثوانٍ سيصبح موقعك متاحاً على رابط مثل
   `https://your-project.vercel.app`.

> ملاحظة: الحد من الطلبات يُخزَّن في الذاكرة، وعلى Vercel (Serverless) يكون فعالاً
> داخل نفس النسخة الدافئة. للحد الصارم عالمياً يمكن الاعتماد على Vercel WAF أو
> قاعدة البيانات.

---

## 🧪 أوامر مفيدة

```bash
npm run dev        # وضع التطوير
npm run build      # بناء الإنتاج
npm run start      # تشغيل نسخة الإنتاج
npm run lint       # فحص ESLint
npm run typecheck  # فحص TypeScript
npx drizzle-kit push  # تطبيق مخطط قاعدة البيانات
```

---

## 📜 الترخيص

مشروع مفتوح للاستخدام الشخصي والتعليمي والتجاري بدون قيود.
