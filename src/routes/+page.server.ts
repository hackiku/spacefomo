// src/routes/+page.server.ts
import { db } from '$lib/db';
import { weeks } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	try {
		// Get all weeks, ordered by week number
		const data = await db.select().from(weeks).orderBy(desc(weeks.weekNumber));

		if (!data?.length) {
			return {
				weeks: [],
				currentWeek: null,
				debug: { error: 'No weeks found' }
			};
		}

		return {
			weeks: data,
			currentWeek: data[0], // Most recent week
			debug: { success: true, weekCount: data.length }
		};

	} catch (error) {
		console.error('Data fetch error:', error);
		return {
			weeks: [],
			currentWeek: null,
			debug: { error: 'Fetch failed', details: String(error) }
		};
	}
}