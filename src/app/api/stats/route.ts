import { getUsageStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getUsageStats();
  return Response.json(
    { ok: true, stats },
    { headers: { "Cache-Control": "no-store" } },
  );
}
