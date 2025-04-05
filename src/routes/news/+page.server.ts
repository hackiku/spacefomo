// src/routes/news/+page.server.ts
import { supabase } from '$lib/services/supabase/client';

export async function load() {
	try {
		const { data, error } = await supabase
			.from('space_news')
			.select('id, title, viral_title, slug, fomo_score, source, publication_date, tags')
			.order('created_at', { ascending: false });

		if (error) throw error;

		return {
			articles: data || []
		};
	} catch (err) {
		console.error('Error loading news:', err);
		return {
			articles: [],
			error: err instanceof Error ? err.message : 'Unknown error loading news'
		};
	}
}