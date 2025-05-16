// src/routes/api/v1/news/+server.ts
import { json } from '@sveltejs/kit';
import { getNewsFeed } from '$lib/server/api/news/handlers';

export async function GET({ url }) {
	try {
		const result = await getNewsFeed(url);
		return json(result);
	} catch (error) {
		console.error('API error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}