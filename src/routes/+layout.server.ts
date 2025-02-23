// src/routes/+layout.server.ts
import { db } from '$lib/db';
import { weeks, news } from '$lib/db/schema';
import { sql } from 'drizzle-orm';

export async function load() {
	try {
		// Fetch weeks and news concurrently with correct ordering
		const [weeksData, newsData] = await Promise.all([
			db.select().from(weeks)
				.orderBy(sql`"week_number" DESC`),
			db.select().from(news)
				.orderBy(sql`"fomo_score" DESC`)
				.limit(50)
		]);

		return {
			weeks: weeksData,
			currentWeek: weeksData[0],
			news: newsData,
			debug: { success: true, weekCount: weeksData.length }
		};
	} catch (error) {
		console.error('Data fetch error:', error);
		return {
			weeks: [],
			currentWeek: null,
			news: [],
			debug: { error: 'Fetch failed', details: String(error) }
		};
	}
}