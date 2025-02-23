// src/lib/db/schema.ts
import { pgTable, bigint, integer, timestamp, text, jsonb, boolean, varchar, date, index } from 'drizzle-orm/pg-core';

export const news = pgTable('news', {
	id: bigint('id', { mode: 'number' }).primaryKey(),  // Removed autoIncrement as per Supabase schema
	title: text('title').notNull(),
	url: varchar('url', { length: 2048 }).notNull(),
	source: varchar('source', { length: 255 }),
	readTime: integer('read_time'),
	fomoScore: integer('fomo_score'),
	tags: jsonb('tags').$type<string[]>(),
	weekId: bigint('week_id', { mode: 'number' }).references(() => weeks.id),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	entities: jsonb('entities').$type<Record<string, any>>(),
	context: jsonb('context').$type<Record<string, any>>(),
	impactScore: integer('impact_score'),
	publicationDate: date('publication_date'),
	viralTitle: varchar('viral_title', { length: 255 })
}, (table) => {
	return {
		scoreIdx: index('news_items_score_idx').on(table.fomoScore),
		entitiesIdx: index('news_items_entities_idx').on(table.entities),
		contextIdx: index('news_items_context_idx').on(table.context)
	};
});

// The weeks table structure remains largely the same
export const weeks = pgTable('weeks', {
	id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	weekNumber: integer('week_number').notNull(),
	score: integer('score').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	startDate: timestamp('start_date', { withTimezone: true }).notNull(),
	endDate: timestamp('end_date', { withTimezone: true }).notNull(),
	summary: text('summary').notNull(),
	stats: jsonb('stats').$type<{
		launchActivity: number;
		industryBuzz: number;
		techImpact: number;
	}>().notNull()
});


export const submissions = pgTable('submissions', {
	id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	url: varchar('url', { length: 2048 }).notNull(),
	comment: text('comment'),
	fomoScore: integer('fomo_score'),
	email: varchar('email', { length: 255 }),
	published: boolean('published').default(false).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	weekId: bigint('week_id', { mode: 'number' }).references(() => weeks.id)
});

export const subscribers = pgTable('subscribers', {
	id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	email: varchar('email', { length: 255 }).notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
	source: varchar('source', { length: 50 }).notNull() // 'submission' or 'newsletter'
});