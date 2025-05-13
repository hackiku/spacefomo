// src/routes/events/+page.server.ts
import { supabase } from '$lib/server/supabase/client';

export async function load() {
	try {
		// First get all events
		const { data: events, error } = await supabase
			.from('events')
			.select(`
        id, 
        title, 
        slug, 
        summary, 
        fomo_score, 
        impact_score, 
        tags, 
        event_date,
        entities,
        context,
        event_sources(
          news_id, 
          is_primary
        )
      `)
			.order('created_at', { ascending: false });

		if (error) throw error;

		// If we don't have any events yet, let's just return the news items as a fallback
		if (!events || events.length === 0) {
			const { data: news, error: newsError } = await supabase
				.from('news')
				.select('id, title, viral_title, slug, fomo_score, source, publication_date, tags, summary')
				.order('created_at', { ascending: false })
				.limit(10);

			if (newsError) throw newsError;

			// Format news items as pseudo-events for testing
			const pseudoEvents = news.map(item => ({
				id: item.id,
				title: item.viral_title || item.title,
				slug: item.slug,
				summary: item.summary,
				fomo_score: item.fomo_score,
				impact_score: item.fomo_score * 0.8, // Just for testing
				tags: item.tags,
				event_date: item.publication_date,
				source_count: 1,
				primary_source: item.source
			}));

			return {
				events: pseudoEvents,
				isTestData: true
			};
		}

		// Process events to add source_count and primary_source
		const processedEvents = events.map(event => {
			const sources = event.event_sources || [];
			const primarySource = sources.find(s => s.is_primary)?.news_id;

			return {
				...event,
				source_count: sources.length,
				primary_source: primarySource
			};
		});

		return {
			events: processedEvents,
			isTestData: false
		};
	} catch (err) {
		console.error('Error loading events:', err);
		return {
			events: [],
			error: err instanceof Error ? err.message : 'Unknown error loading events',
			isTestData: false
		};
	}
}