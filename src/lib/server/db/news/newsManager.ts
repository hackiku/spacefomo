// src/lib/db/news/newsManager.ts
import { db } from '../index';
import { newsItems } from '../schema';

export async function syncNewsItems(items: Array<Partial<typeof newsItems.$inferInsert>>) {
	try {
		const results = await db
			.insert(newsItems)
			.values(items)
			.onConflictDoUpdate({
				target: [newsItems.url],
				set: {
					title: sql`EXCLUDED.title`,
					score: sql`EXCLUDED.score`,
					tags: sql`EXCLUDED.tags`,
					readTime: sql`EXCLUDED.read_time`
				}
			})
			.returning();

		console.log(`Successfully synced ${results.length} news items`);
		return results;
	} catch (error) {
		console.error('News sync failed:', error);
		throw error;
	}
}