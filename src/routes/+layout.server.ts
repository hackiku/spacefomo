// src/routes/+layout.server.ts
import { db } from '$lib/server/db';
import { weeks, news } from '$lib/server/db/schema';
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





// import { supabase } from '$lib/services/supabase/client';

// export async function load() {
// 	try {
// 		// Fetch weeks and news concurrently
// 		const [weeksResponse, newsResponse] = await Promise.all([
// 			supabase
// 				.from('weeks')
// 				.select('*')
// 				.order('week_number', { ascending: false }),
// 			supabase
// 				.from('space_news')  // Changed from 'news' to 'space_news'
// 				.select('*')
// 				.order('fomo_score', { ascending: false })
// 				.limit(50)
// 		]);

// 		if (weeksResponse.error) throw weeksResponse.error;
// 		if (newsResponse.error) throw newsResponse.error;

// 		return {
// 			weeks: weeksResponse.data || [],
// 			currentWeek: weeksResponse.data?.[0] || null,
// 			news: newsResponse.data || [],
// 			debug: { success: true, weekCount: weeksResponse.data?.length || 0 }
// 		};
// 	} catch (error) {
// 		console.error('Data fetch error:', error);
// 		return {
// 			weeks: [],
// 			currentWeek: null,
// 			news: [],
// 			debug: { error: 'Fetch failed', details: String(error) }
// 		};
// 	}
// }