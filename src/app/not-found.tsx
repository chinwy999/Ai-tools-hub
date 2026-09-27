import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { TOOLS } from "@/lib/tools";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-900/40">
        <Compass className="h-10 w-10 text-white" />
      </span>
      <h1 className="mt-7 text-4xl font-extrabold text-white">الصفحة غير موجودة</h1>
      <p className="mt-3 text-sm leading-7 text-slate-400">
        الرابط الذي طلبته غير متاح. يمكنك العودة إلى الصفحة الرئيسية أو الانتقال إلى إحدى
        الأدوات التالية مباشرة.
      </p>
      <Link href="/" className="btn-primary mt-7">
        العودة للرئيسية
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
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
    </div>
  );
}
