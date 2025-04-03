// src/routes/api/v1/news/[id]/+server.ts
import { error, json } from '@sveltejs/kit';
import { fetchNewsById } from '$lib/services/news/newsService';

export async function GET({ params }) {
	const id = parseInt(params.id);

	if (isNaN(id)) {
		throw error(400, { message: 'Invalid ID format' });
	}

	try {
		const item = await fetchNewsById(id);
		return json(item);
	} catch (e) {
		console.error(`Error fetching news item ${id}:`, e);
		throw error(404, {
			message: e instanceof Error ? e.message : 'News item not found'
		});
	}
}