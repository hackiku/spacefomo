// src/lib/db/schema.ts
import { pgTable, bigint, integer, timestamp, text, jsonb, boolean, varchar } from 'drizzle-orm/pg-core';

export const newsItems = pgTable('news_items', {
	id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	url: varchar('url', { length: 2048 }).notNull(),
	source: varchar('source', { length: 255 }),
	readTime: integer('read_time'),
	score: integer('score'),
	tags: jsonb('tags').$type<string[]>(),
	weekId: bigint('week_id', { mode: 'number' }).references(() => weeks.id),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});



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