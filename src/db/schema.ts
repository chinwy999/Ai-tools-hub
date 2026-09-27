import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * سجل استخدام الأدوات — يُستخدم لعرض إحصائيات الموقع الحية
 * ولمراقبة عدد الطلبات لكل أداة.
 */
export const toolRuns = pgTable(
  "tool_runs",
  {
    id: serial("id").primaryKey(),
    tool: varchar("tool", { length: 64 }).notNull(),
    engine: varchar("engine", { length: 32 }).notNull().default("demo"),
    model: varchar("model", { length: 96 }),
    success: boolean("success").notNull().default(true),
    latencyMs: integer("latency_ms").notNull().default(0),
    inputChars: integer("input_chars").notNull().default(0),
    outputChars: integer("output_chars").notNull().default(0),
    language: varchar("language", { length: 48 }),
    label: varchar("label", { length: 48 }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("tool_runs_tool_idx").on(table.tool),
    index("tool_runs_created_at_idx").on(table.createdAt),
  ],
);

export type ToolRun = typeof toolRuns.$inferSelect;
export type NewToolRun = typeof toolRuns.$inferInsert;
