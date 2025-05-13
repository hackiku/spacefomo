// src/routes/api/admin/events/+server.ts

import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase/client';

export async function GET({ url }) {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '10');

		// Get recent events with source count
		const { data: events, error: fetchError } = await supabase
			.from('events')
			.select(`
        id, 
        title, 
        slug, 
        fomo_score, 
        created_at
      `)
			.order('created_at', { ascending: false })
			.limit(limit);

		if (fetchError) {
			throw error(500, { message: fetchError.message });
		}

		// Add source count for each event
		const eventsWithCounts = await Promise.all((events || []).map(async (event) => {
			// Get sources count
			const { count, error: countError } = await supabase
				.from('event_sources')
				.select('*', { count: 'exact', head: true })
				.eq('event_id', event.id);

			return {
				...event,
				source_count: countError ? 0 : count
			};
		}));

		return json({
			events: eventsWithCounts
		});
	} catch (err) {
		console.error('Error fetching events:', err);
		throw error(500, {
			message: err.message || 'Error fetching events',
			details: err
		});
	}
}