// src/routes/api/v1/news/[id]/+server.ts
import { json, error } from '@sveltejs/kit';
import { getNewsItemById } from '$lib/services/api/newsApiService';

export async function GET({ params }) {
	const id = parseInt(params.id);

	if (isNaN(id)) {
		throw error(400, 'Invalid ID format');
	}

	try {
		const item = await getNewsItemById(id);
		return json(item);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';

		if (message.includes('not found')) {
			throw error(404, message);
		}

		throw error(500, message);
	}
}