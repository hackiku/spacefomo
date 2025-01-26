// src/routes/api/refresh-news/+server.ts
import { getNewsItems } from '$lib/server/notion';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	try {
		const news = await getNewsItems(true); // Force refresh
		return json({ success: true, count: news.length });
	} catch (error) {
		console.error('Failed to refresh news:', error);
		return json({
			error: 'Failed to refresh news'
		}, { status: 500 });
	}
};