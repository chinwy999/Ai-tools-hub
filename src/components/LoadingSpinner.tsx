import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
};

const SIZES = {
  sm: "h-4 w-4 border-2",
  md: "h-7 w-7 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export default function LoadingSpinner({
  size = "md",
  label,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-block animate-spin rounded-full border-white/25 border-t-white ${SIZES[size]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        {spinner}
        {label ? <p className="text-sm font-semibold text-slate-300">{label}</p> : null}
      </div>
    );
  }

  if (!label) return spinner;

  return (
    <span className="inline-flex items-center gap-3">
      {spinner}
      <span className="text-sm font-semibold text-slate-200">{label}</span>
    </span>
  );
}

/** مؤشر تحميل بأيقونة Loader2 للاستخدام داخل الأزرار */
export function ButtonSpinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
