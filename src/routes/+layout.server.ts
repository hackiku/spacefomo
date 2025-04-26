// src/routes/+layout.server.ts
import { supabase } from '$lib/server/supabase/client';

export async function load() {
	try {
		// Fetch weeks and news concurrently
		const [weeksResponse, newsResponse] = await Promise.all([
			supabase
				.from('weeks')
				.select('*')
				.order('week_number', { ascending: false }),
			supabase
				.from('news')
				.select('*, seo')  // Explicitly select SEO data
				.order('fomo_score', { ascending: false })
				.limit(50)
		]);

		if (weeksResponse.error) throw weeksResponse.error;
		if (newsResponse.error) throw newsResponse.error;

		return {
			weeks: weeksResponse.data || [],
			currentWeek: weeksResponse.data?.[0] || null,
			news: newsResponse.data || [],
			debug: { success: true, weekCount: weeksResponse.data?.length || 0 }
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