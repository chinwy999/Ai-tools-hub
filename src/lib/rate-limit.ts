/**
 * حد بسيط لعدد الطلبات (Rate limiting) في الذاكرة.
 * يكفي للمشاريع المجانية الصغيرة، ويمنع إساءة الاستخدام الأساسية.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
let lastCleanup = Date.now();

const LIMIT_PER_WINDOW = Number(process.env.RATE_LIMIT ?? 12);
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);

function cleanup(now: number) {
  if (now - lastCleanup < WINDOW_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    bucket.hits = bucket.hits.filter((time) => now - time < WINDOW_MS);
    if (bucket.hits.length === 0) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  limit: number;
};

export function rateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const bucket = buckets.get(identifier) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((time) => now - time < WINDOW_MS);

  if (bucket.hits.length >= LIMIT_PER_WINDOW) {
    const oldest = bucket.hits[0] ?? now;
    buckets.set(identifier, bucket);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
      limit: LIMIT_PER_WINDOW,
    };
  }

  bucket.hits.push(now);
  buckets.set(identifier, bucket);

  return {
    allowed: true,
    remaining: LIMIT_PER_WINDOW - bucket.hits.length,
    retryAfterSeconds: 0,
    limit: LIMIT_PER_WINDOW,
  };
}

/** استخراج عنوان IP التقريبي من ترويسات الطلب. */
export function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "local"
  );
}
