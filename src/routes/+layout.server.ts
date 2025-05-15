// src/routes/+layout.server.ts
import { supabase } from '$lib/server/supabase/client';

export async function load() {
	try {
		// Fetch news and processed_news concurrently
		const [newsResponse, processedNewsResponse] = await Promise.all([
			supabase
				.from('news')
				.select('*, seo')
				.order('fomo_score', { ascending: false })
				.limit(50),
			supabase
				.from('processed_news')
				.select('*, seo')
				.order('fomo_score', { ascending: false })
				.limit(50)
		]);

		if (newsResponse.error) throw newsResponse.error;
		if (processedNewsResponse.error) throw processedNewsResponse.error;

		return {
			news: newsResponse.data || [],
			processedNews: processedNewsResponse.data || [],
			debug: {
				success: true,
				newsCount: newsResponse.data?.length || 0,
				processedNewsCount: processedNewsResponse.data?.length || 0
			}
		};
	} catch (error) {
		console.error('Data fetch error:', error);
		return {
			news: [],
			processedNews: [],
			debug: { error: 'Fetch failed', details: String(error) }
		};
	}
}