import { sql } from "drizzle-orm";
import { db } from "@/db";
import { toolRuns } from "@/db/schema";
import { TOOLS } from "./tools";

export type ToolStat = {
  tool: string;
  name: string;
  runs: number;
  avgLatencyMs: number;
};

export type UsageStats = {
  totalRuns: number;
  successfulRuns: number;
  last24h: number;
  perTool: ToolStat[];
  available: boolean;
};

const EMPTY: UsageStats = {
  totalRuns: 0,
  successfulRuns: 0,
  last24h: 0,
  perTool: TOOLS.map((tool) => ({
    tool: tool.slug,
    name: tool.shortName,
    runs: 0,
    avgLatencyMs: 0,
  })),
  available: false,
};

/** إحصائيات الاستخدام لعرضها في الصفحة الرئيسية. */
export async function getUsageStats(): Promise<UsageStats> {
  if (!db) {
    return EMPTY;
  }

  try {
    const grouped = await db
      .select({
        tool: toolRuns.tool,
        runs: sql<number>`count(*)::int`,
        avgLatency: sql<number>`coalesce(round(avg(${toolRuns.latencyMs}))::int, 0)`,
        successful: sql<number>`coalesce(sum(case when ${toolRuns.success} then 1 else 0 end), 0)::int`,
      })
      .from(toolRuns)
      .groupBy(toolRuns.tool);

    const recent = await db
      .select({
        runs: sql<number>`count(*)::int`,
      })
      .from(toolRuns)
      .where(sql`${toolRuns.createdAt} > now() - interval '24 hours'`);

    const perTool: ToolStat[] = TOOLS.map((tool) => {
      const row = grouped.find((item) => item.tool === tool.slug);
      return {
        tool: tool.slug,
        name: tool.shortName,
        runs: row?.runs ?? 0,
        avgLatencyMs: row?.avgLatency ?? 0,
      };
    });

    return {
      totalRuns: grouped.reduce((sum, row) => sum + (row.runs ?? 0), 0),
      successfulRuns: grouped.reduce((sum, row) => sum + (row.successful ?? 0), 0),
      last24h: recent[0]?.runs ?? 0,
      perTool,
      available: true,
    };
  } catch {
    return EMPTY;
  }
}
