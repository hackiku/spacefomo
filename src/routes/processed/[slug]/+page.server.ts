// src/routes/events/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase/client';

export async function load({ params }) {
	const { slug } = params;

	try {
		// First try to get event by slug
		const { data: event, error: eventError } = await supabase
			.from('events')
			.select(`
        id, 
        title, 
        slug, 
        summary, 
        fomo_score, 
        impact_score, 
        tags, 
        entities,
        context,
        event_date,
        created_at,
        updated_at
      `)
			.eq('slug', slug)
			.single();

		// If event not found by slug, try to get by ID (for test data)
		if (eventError || !event) {
			// Check if the slug might be a numeric ID (for test data/fallback)
			const numericId = parseInt(slug);
			if (!isNaN(numericId)) {
				// Try to get a news item by ID as fallback
				const { data: newsItem, error: newsError } = await supabase
					.from('news')
					.select('id, title, viral_title, slug, fomo_score, source, publication_date, tags, summary')
					.eq('id', numericId)
					.single();

				if (newsError || !newsItem) {
					throw error(404, { message: 'Event not found' });
				}

				// Convert news item to event format for display
				const fakeEvent = {
					id: newsItem.id,
					title: newsItem.viral_title || newsItem.title,
					slug: newsItem.slug || slug,
					summary: newsItem.summary,
					fomo_score: newsItem.fomo_score,
					impact_score: Math.floor(newsItem.fomo_score * 0.9),
					tags: newsItem.tags || [],
					event_date: newsItem.publication_date,
					created_at: newsItem.created_at,
					entities: {},
					context: {}
				};

				// Return test data
				return {
					event: fakeEvent,
					sources: [{
						id: newsItem.id,
						title: newsItem.title,
						url: newsItem.url || '#',
						source: newsItem.source,
						summary: newsItem.summary,
						fomo_score: newsItem.fomo_score,
						publication_date: newsItem.publication_date,
						tags: newsItem.tags || [],
						is_primary: true
					}],
					primarySource: {
						source: newsItem.source,
						url: newsItem.url || '#'
					},
					sourceCount: 1,
					isTestData: true
				};
			}

			throw error(404, { message: 'Event not found' });
		}

		// Get all sources for this event with details
		const { data: sources, error: sourcesError } = await supabase
			.from('event_sources')
			.select(`
        is_primary,
        processed_news (
          id,
          title,
          url,
          source,
          summary,
          fomo_score,
          publication_date,
          tags,
          slug
        )
      `)
			.eq('event_id', event.id)
			.order('is_primary', { ascending: false });

		if (sourcesError) {
			console.error('Error fetching sources:', sourcesError);
		}

		// Format sources for easier consumption
		const formattedSources = (sources || []).map(source => ({
			...source.processed_news,
			is_primary: source.is_primary
		}));

		// Get the primary source
		const primarySource = formattedSources.find(source => source.is_primary);

		return {
			event,
			sources: formattedSources,
			primarySource,
			sourceCount: formattedSources.length,
			isTestData: false
		};
	} catch (err) {
		console.error('Error loading event:', err);
		throw error(404, {
			message: 'Event not found'
		});
	}
}