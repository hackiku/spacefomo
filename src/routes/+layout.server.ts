// src/routes/+layout.server.ts
import { db } from '$lib/db';
import { weeks, news } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	try {
		// Fetch weeks and news concurrently for better performance
		const [weeksData, newsData] = await Promise.all([
			db.select().from(weeks).orderBy(desc(weeks.weekNumber)),
			db.select().from(news)
				.orderBy(desc(news.fomo_score))
				.limit(50)  // Adjust based on your needs
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