// src/routes/api/submissions/+server.ts
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function GET({ url }) {
	try {
		// Extract query parameters
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const published = url.searchParams.get('published') === 'true';

		// Validate parameters
		if (isNaN(limit) || isNaN(offset) || limit < 1 || limit > 100 || offset < 0) {
			throw error(400, { message: 'Invalid pagination parameters' });
		}

		// Build query
		let query = supabase
			.from('submissions')
			.select(`
        id,
        url,
        fomo_score,
        email,
        published,
        created_at,
        week_id,
        weeks (id, week_number)
      `)
			.order('created_at', { ascending: false })
			.limit(limit)
			.range(offset, offset + limit - 1);

		// Filter by published status if specified
		if (url.searchParams.has('published')) {
			query = query.eq('published', published);
		}

		// Execute query
		const { data, error: queryError, count } = await query;

		if (queryError) {
			console.error('Error fetching submissions:', queryError);
			throw error(500, { message: 'Failed to fetch submissions' });
		}

		// Return submissions
		return json({
			submissions: data || [],
			pagination: {
				limit,
				offset,
				total: count || data?.length || 0
			}
		});
	} catch (err) {
		console.error('API error:', err);
		if (err.status && err.body) {
			throw error(err.status, err.body.message || 'Failed to retrieve submissions');
		}
		throw error(500, { message: 'Unexpected error retrieving submissions' });
	}
}