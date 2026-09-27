"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  Copy,
  Download,
  Eraser,
  KeyRound,
  Lightbulb,
  Sparkles,
  Zap,
} from "lucide-react";
import LoadingSpinner, { ButtonSpinner } from "./LoadingSpinner";
import { LANGUAGES, TOOLS, type ToolDefinition, type ToolSlug, getTool } from "@/lib/tools";
import type { SentimentResult } from "@/lib/demo-engine";

type ApiMeta = {
  engine: "groq" | "demo";
  model: string | null;
  elapsedMs: number;
  notice: string | null;
};

type ToolResult =
  | { kind: "text"; text: string; changes?: string[] }
  | { kind: "points"; points: string[] }
  | { kind: "sentiment"; data: SentimentResult };

const SENTIMENT_STYLES: Record<
  SentimentResult["labelKey"],
  { badge: string; bar: string; ring: string; icon: string; text: string }
> = {
  positive: {
    badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/40",
    bar: "from-emerald-400 to-teal-500",
    ring: "ring-emerald-400/40",
    icon: "😊",
    text: "إيجابي",
  },
  negative: {
    badge: "bg-rose-500/15 text-rose-200 border-rose-400/40",
    bar: "from-rose-400 to-red-500",
    ring: "ring-rose-400/40",
    icon: "😞",
    text: "سلبي",
  },
  neutral: {
    badge: "bg-slate-500/15 text-slate-200 border-slate-400/40",
    bar: "from-slate-300 to-slate-500",
    ring: "ring-slate-400/40",
    icon: "😐",
    text: "محايد",
  },
};

function swapDirection(code: string): string {
  if (code === "ar") return "en";
  if (code === "en") return "ar";
  return "auto";
}

export default function ToolWorkspace({ slug }: { slug: ToolSlug }) {
  const tool: ToolDefinition = getTool(slug) ?? TOOLS[0]!;
  const [input, setInput] = useState("");
  const [source, setSource] = useState("auto");
  const [target, setTarget] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [copied, setCopied] = useState(false);

  const isTranslator = tool.slug === "translator";
  const isSummarizer = tool.slug === "summarizer";

  const plainText = useMemo(() => {
    if (!result) return "";
    if (result.kind === "text") return result.text;
    if (result.kind === "points") {
      return `ملخص النص:\n${result.points.map((point) => `• ${point}`).join("\n")}`;
    }
    const data = result.data;
    return [
      `نتيجة تحليل المشاعر`,
      `التصنيف: ${data.label}`,
      `نسبة الثقة: ${data.confidence}%`,
      `التوزيع: إيجابي ${data.scores.positive}% / سلبي ${data.scores.negative}% / محايد ${data.scores.neutral}%`,
      data.keywords.length > 0 ? `كلمات دالة: ${data.keywords.join("، ")}` : "",
      `التفسير: ${data.explanation}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [result]);

  const wordCount = useMemo(
    () => input.trim().split(/\s+/).filter(Boolean).length,
    [input],
  );

  const handleCopy = useCallback(async () => {
    if (!plainText) return;
    try {
      await navigator.clipboard.writeText(plainText);
    } catch {
      const area = document.createElement("textarea");
      area.value = plainText;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [plainText]);

  const handleDownload = useCallback(() => {
    if (!plainText) return;
    const header = `AI Tools Hub — ${tool.name}\n${new Date().toLocaleString("ar-EG")}\n${"=".repeat(46)}\n\n`;
    const blob = new Blob([header + plainText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-tools-hub-${tool.slug}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [plainText, tool.name, tool.slug]);

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
    setError(null);
    setMeta(null);
    setCopied(false);
  }, []);

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      if (loading) return;

      const value = input.trim();
      if (value.length < tool.minLength) {
        setError(
          `يرجى إدخال ${tool.minLength} حرفاً على الأقل. النص الحالي ${value.length} حرف فقط.`,
        );
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);
      setMeta(null);

      try {
        const response = await fetch(tool.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: value,
            topic: value,
            source,
            target,
            points: "4",
          }),
        });

        const payload = (await response.json()) as {
          ok?: boolean;
          error?: string;
          result?: unknown;
          meta?: ApiMeta;
        };

        if (!response.ok || !payload.ok) {
          setError(
            payload.error ??
              "حدث خطأ غير متوقع أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.",
          );
          setMeta(payload.meta ?? null);
          return;
        }

        setMeta(payload.meta ?? null);

        if (tool.variant === "sentiment") {
          const data = payload.result as SentimentResult | undefined;
          if (!data?.label) {
            setError("تعذّر تحليل النص. يرجى المحاولة بنص آخر.");
            return;
          }
          setResult({ kind: "sentiment", data });
          return;
        }

        if (tool.variant === "points") {
          const data = payload.result as { points?: string[] } | undefined;
          if (!data?.points || data.points.length === 0) {
            setError("تعذّر تلخيص هذا النص. يرجى المحاولة بنص أطول أو أوضح.");
            return;
          }
          setResult({ kind: "points", points: data.points });
          return;
        }

        const data = payload.result as
          | { text?: string; changes?: string[] }
          | undefined;
        if (!data?.text) {
          setError("لم تصل نتيجة صالحة من الخدمة. يرجى إعادة المحاولة.");
          return;
        }
        setResult({ kind: "text", text: data.text, changes: data.changes });
      } catch {
        setError(
          "تعذّر الاتصال بالخدمة. تأكد من اتصالك بالإنترنت ثم أعد المحاولة.",
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading, source, target, tool.endpoint, tool.minLength, tool.variant],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        void handleSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSubmit]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* منطقة الإدخال */}
      <form
        onSubmit={handleSubmit}
        className="glass-card animate-fade-up flex flex-col rounded-3xl p-5 sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="tool-input" className="text-sm font-bold text-white">
            {tool.inputLabel}
          </label>
          <button
            type="button"
            onClick={() => {
              setInput(tool.sample);
              setError(null);
            }}
            className="btn-ghost !px-3 !py-1.5 !text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            تجربة مثال
          </button>
        </div>

        {isTranslator && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="source-lang" className="mb-1.5 block text-xs font-semibold text-slate-400">
                من لغة
              </label>
              <select
                id="source-lang"
                className="field !py-3 !text-sm"
                value={source}
                onChange={(event) => setSource(event.target.value)}
              >
                <option value="auto">كشف تلقائي</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="target-lang" className="mb-1.5 block text-xs font-semibold text-slate-400">
                إلى لغة
              </label>
              <select
                id="target-lang"
                className="field !py-3 !text-sm"
                value={target}
                onChange={(event) => {
                  setTarget(event.target.value);
                  setSource(swapDirection(event.target.value));
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                setSource(target === "ar" ? "en" : "ar");
                setTarget(source === "auto" ? "ar" : source === "ar" ? "en" : source);
              }}
              className="btn-ghost !py-2.5 sm:col-span-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
              تبديل اتجاه الترجمة
            </button>
          </div>
        )}

        <textarea
          id="tool-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={tool.inputPlaceholder}
          maxLength={tool.maxLength}
          rows={isSummarizer ? 14 : 10}
          className="field mt-4 flex-1 resize-y"
          dir="auto"
        />

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {input.length.toLocaleString("ar-EG")} / {tool.maxLength.toLocaleString("ar-EG")} حرف
            {" · "}
            {wordCount.toLocaleString("ar-EG")} كلمة
          </span>
          <span className="hidden sm:inline">اختصار: Ctrl + Enter للتنفيذ</span>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3.5 text-sm text-rose-100"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-500/25 text-xs font-bold">
              !
            </span>
            <p className="leading-6">{error}</p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="submit"
            disabled={loading || input.trim().length < tool.minLength}
            className={`btn-primary flex-1 bg-gradient-to-br sm:flex-none ${
              tool.slug === "sentiment"
                ? "from-orange-500 to-rose-600"
                : tool.slug === "writing-enhancer"
                  ? "from-emerald-500 to-teal-600"
                  : tool.slug === "translator"
                    ? "from-cyan-500 to-blue-600"
                    : tool.slug === "summarizer"
                      ? "from-purple-500 to-fuchsia-600"
                      : "from-blue-500 to-indigo-600"
            }`}
          >
            {loading ? (
              <ButtonSpinner label={tool.loadingLabel} />
            ) : (
              <>
                <Zap className="h-4 w-4" />
                {tool.submitLabel}
              </>
            )}
          </button>
          <button type="button" onClick={handleClear} disabled={loading} className="btn-ghost">
            <Eraser className="h-4 w-4" />
            مسح الحقول
          </button>
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-slate-500">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/80" />
          {tool.tips[0]}
        </p>
      </form>

      {/* منطقة النتيجة */}
      <section className="glass-card animate-fade-up anim-delay-1 flex flex-col rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-white">النتيجة</h2>
          {meta && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                meta.engine === "groq"
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                  : "border-amber-400/30 bg-amber-500/10 text-amber-200"
              }`}
            >
              {meta.engine === "groq" ? (
                <>
                  <Zap className="h-3 w-3" /> Llama 3 · {(meta.elapsedMs / 1000).toFixed(1)} ثانية
                </>
              ) : (
                <>
                  <KeyRound className="h-3 w-3" /> محرك تجريبي محلي
                </>
              )}
            </span>
          )}
        </div>

        {meta?.notice && (
          <div className="mt-3 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-3 text-xs leading-6 text-amber-100">
            {meta.notice}
          </div>
        )}

        <div className="mt-4 flex-1">
          {loading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <LoadingSpinner size="md" />
                <span className="text-sm font-semibold text-slate-200">{tool.loadingLabel}</span>
              </div>
              {[100, 92, 96, 78, 88].map((width, index) => (
                <div
                  key={index}
                  className="skeleton h-3.5 rounded-full"
                  style={{ width: `${width}%` }}
                />
              ))}
              <div className="skeleton h-3.5 w-2/3 rounded-full" />
            </div>
          ) : !result ? (
            <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-center">
              <span
                className={`grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${tool.accentFrom} ${tool.accentTo} opacity-90`}
              >
                <tool.icon className="h-8 w-8 text-white" />
              </span>
              <p className="mt-4 text-sm font-bold text-white">النتيجة ستظهر هنا</p>
              <p className="mt-1.5 max-w-xs text-xs leading-6 text-slate-400">
                اكتب أو الصق النص في الحقل المجاور ثم اضغط «{tool.submitLabel}».
              </p>
            </div>
          ) : (
            <div className="animate-fade-up space-y-4">
              {result.kind === "sentiment" ? (
                <SentimentCard data={result.data} />
              ) : result.kind === "points" ? (
                <ol className="space-y-3">
                  {result.points.map((point, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-slate-100">{point}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  <div
                    dir="auto"
                    className="max-h-[28rem] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-8 text-slate-100"
                  >
                    {result.text}
                  </div>
                  {result.changes && result.changes.length > 0 && (
                    <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4">
                      <p className="text-xs font-bold text-emerald-200">
                        أهم التحسينات المطبقة
                      </p>
                      <ul className="mt-2.5 space-y-1.5">
                        {result.changes.map((change) => (
                          <li
                            key={change}
                            className="flex items-start gap-2 text-xs leading-6 text-emerald-100"
                          >
                            <Check className="mt-1 h-3.5 w-3.5 shrink-0" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {!loading && result && (
          <div className="mt-5 flex flex-wrap gap-2.5 border-t border-white/10 pt-4">
            <button type="button" onClick={handleCopy} className="btn-ghost">
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  نسخ النتيجة
                </>
              )}
            </button>
            <button type="button" onClick={handleDownload} className="btn-ghost">
              <Download className="h-4 w-4" />
              تحميل كملف نصي
            </button>
            <button type="button" onClick={handleClear} className="btn-ghost">
              <Eraser className="h-4 w-4" />
              مسح
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function SentimentCard({ data }: { data: SentimentResult }) {
  const style = SENTIMENT_STYLES[data.labelKey] ?? SENTIMENT_STYLES.neutral;

  const rows: { key: keyof SentimentResult["scores"]; label: string; value: number }[] = [
    { key: "positive", label: "إيجابي", value: data.scores.positive },
    { key: "negative", label: "سلبي", value: data.scores.negative },
    { key: "neutral", label: "محايد", value: data.scores.neutral },
  ];

  return (
    <div className={`animate-fade-up space-y-5 rounded-2xl border border-white/10 bg-black/25 p-5 ring-1 ${style.ring}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400">تصنيف النص</p>
          <p className="mt-1 flex items-center gap-2 text-3xl font-extrabold text-white">
            <span>{style.icon}</span>
            {data.label}
          </p>
        </div>
        <span
          className={`rounded-2xl border px-4 py-3 text-center ${style.badge}`}
        >
          <span className="block text-2xl font-extrabold leading-none">
            {data.confidence}%
          </span>
          <span className="mt-1 block text-[11px] font-semibold">نسبة الثقة</span>
        </span>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>مستوى الثقة في النتيجة</span>
          <span>{data.confidence}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700`}
            style={{ width: `${data.confidence}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>{row.label}</span>
              <span>{row.value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700`}
                style={{ width: `${row.value}%`, opacity: row.key === data.labelKey ? 1 : 0.45 }}
              />
            </div>
          </div>
        ))}
      </div>

      {data.keywords.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-300">الكلمات الدالة على المشاعر</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs leading-6 text-slate-300">
        {data.explanation}
      </p>
    </div>
  );
}
