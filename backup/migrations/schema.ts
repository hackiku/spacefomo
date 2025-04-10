// supabase/migrations/schema.ts

import { pgTable, unique, bigint, varchar, timestamp, bigserial, integer, text, jsonb, foreignKey, boolean, index, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const statCategory = pgEnum("stat_category", ['launchActivity', 'industryBuzz', 'techImpact'])


export const subscribers = pgTable("subscribers", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
	source: varchar({ length: 50 }).notNull(),
}, (table) => [
	unique("subscribers_email_unique").on(table.email),
]);

export const weeks = pgTable("weeks", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	weekNumber: integer("week_number").notNull(),
	score: integer().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }).notNull(),
	summary: text().notNull(),
	stats: jsonb().notNull(),
});

export const submissions = pgTable("submissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	url: varchar({ length: 2048 }).notNull(),
	comment: text(),
	fomoScore: integer("fomo_score"),
	email: varchar({ length: 255 }),
	published: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	weekId: bigint("week_id", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.weekId],
			foreignColumns: [weeks.id],
			name: "submissions_week_id_weeks_id_fk"
		}),
]);

export const news = pgTable("news", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	title: text().notNull(),
	url: varchar({ length: 2048 }).notNull(),
	source: varchar({ length: 255 }),
	readTime: integer("read_time"),
	fomoScore: integer("fomo_score"),
	tags: jsonb(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	weekId: bigint("week_id", { mode: "number" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	entities: jsonb(),
	context: jsonb(),
	impactScore: integer("impact_score"),
	publicationDate: date("publication_date"),
	viralTitle: varchar("viral_title", { length: 255 }),
}, (table) => [
	index("news_items_context_idx").using("gin", table.context.asc().nullsLast().op("jsonb_ops")),
	index("news_items_entities_idx").using("gin", table.entities.asc().nullsLast().op("jsonb_ops")),
	index("news_items_score_idx").using("btree", table.fomoScore.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.weekId],
			foreignColumns: [weeks.id],
			name: "news_items_week_id_weeks_id_fk"
		}),
]);
