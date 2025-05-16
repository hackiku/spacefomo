// src/routes/api/v1/news/[id]/+server.ts
import { json, error } from '@sveltejs/kit';
import { getNewsItem } from '$lib/server/api/news/handlers';

export async function GET({ params }) {
	try {
		const id = parseInt(params.id);
		const item = await getNewsItem(id);
		return json(item);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';

		if (message.includes('not found')) {
			throw error(404, message);
		} else if (message.includes('Invalid news ID')) {
			throw error(400, message);
		}

		throw error(500, message);
	}
}