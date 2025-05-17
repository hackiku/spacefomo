// src/routes/events/+page.server.ts
import { supabase } from '$lib/server/db/client';

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
        context
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

		// For actual events, we need to get the sources count and primary source separately
		// since the relationship query is having issues
		const processedEvents = await Promise.all(events.map(async (event) => {
			// Get sources count
			const { count: sourceCount, error: countError } = await supabase
				.from('event_sources')
				.select('*', { count: 'exact', head: true })
				.eq('event_id', event.id);

			if (countError) console.error('Error getting source count:', countError);

			// Get primary source
			const { data: primarySource, error: primaryError } = await supabase
				.from('event_sources')
				.select('news_id')
				.eq('event_id', event.id)
				.eq('is_primary', true)
				.limit(1);

			if (primaryError) console.error('Error getting primary source:', primaryError);

			// If we have a primary source, get its details
			let primarySourceInfo = null;
			if (primarySource && primarySource.length > 0) {
				const { data: sourceDetails, error: sourceError } = await supabase
					.from('processed_news')
					.select('id, source')
					.eq('id', primarySource[0].news_id)
					.single();

				if (!sourceError && sourceDetails) {
					primarySourceInfo = sourceDetails.source;
				}
			}

			return {
				...event,
				source_count: sourceCount || 0,
				primary_source: primarySourceInfo
			};
		}));

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