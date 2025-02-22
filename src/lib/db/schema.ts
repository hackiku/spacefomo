// src/lib/db/schema.ts

import { pgTable, serial, integer, timestamp, text, jsonb } from 'drizzle-orm/pg-core';

export const weeks = pgTable('weeks', {
	id: serial('id').primaryKey(),
	weekNumber: integer('week_number').notNull(),
	score: integer('score').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date').notNull(),
	summary: text('summary').notNull(),
	stats: jsonb('stats').$type<{
		launchActivity: number;
		industryBuzz: number;
		techImpact: number;
	}>().notNull()
});