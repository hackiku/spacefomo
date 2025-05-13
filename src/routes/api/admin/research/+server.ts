// src/routes/api/admin/research/+server.ts

import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase/client';

/**
 * Calls the research-event Supabase Edge Function
 */
async function callResearchFunction(newsId: string, mode: 'mock' | 'real' = 'real') {
	try {
		const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
		const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseAnonKey) {
			throw error(500, { message: 'Supabase configuration missing' });
		}

		// Determine endpoint based on mode
		const endpoint = mode === 'mock'
			? `${supabaseUrl}/functions/v1/research-event/mock`
			: `${supabaseUrl}/functions/v1/research-event`;

		// Call the edge function
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${supabaseAnonKey}`
			},
			body: JSON.stringify({ newsId })
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw error(response.status, {
				message: errorData.error || 'Error from edge function',
				details: errorData
			});
		}

		return await response.json();
	} catch (err) {
		console.error('Error calling research function:', err);
		throw error(500, {
			message: err.message || 'Error researching event',
			details: err
		});
	}
}

/**
 * Process one news item and create an event from its related news
 */
export async function POST({ request }) {
	try {
		const { newsId, mode = 'real' } = await request.json();

		if (!newsId) {
			throw error(400, { message: 'newsId is required' });
		}

		// Check if the news item exists
		const { data: newsItem, error: newsError } = await supabase
			.from('processed_news')
			.select('id, title')
			.eq('id', newsId)
			.single();

		if (newsError || !newsItem) {
			throw error(404, { message: 'News item not found' });
		}

		// Call the edge function (mock or real)
		const result = await callResearchFunction(newsId, mode as 'mock' | 'real');

		return json({
			success: true,
			event: result.data.event,
			sourcesCount: result.data.sourcesCount
		});
	} catch (err) {
		console.error('Error processing event research:', err);
		throw error(err.status || 500, {
			message: err.message || 'Error researching event',
			details: err
		});
	}
}

/**
 * Test the research function without creating events
 */
export async function GET({ url }) {
	try {
		const newsId = url.searchParams.get('newsId');

		if (!newsId) {
			throw error(400, { message: 'newsId query parameter is required' });
		}

		// Create test endpoint URL
		const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
		const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseAnonKey) {
			throw error(500, { message: 'Supabase configuration missing' });
		}

		// Call the test endpoint
		const response = await fetch(`${supabaseUrl}/functions/v1/research-event/test`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${supabaseAnonKey}`
			},
			body: JSON.stringify({ newsId })
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw error(response.status, {
				message: errorData.error || 'Error from edge function',
				details: errorData
			});
		}

		const result = await response.json();

		return json({
			success: true,
			data: result.data
		});
	} catch (err) {
		console.error('Error testing research:', err);
		throw error(err.status || 500, {
			message: err.message || 'Error testing research function',
			details: err
		});
	}
}