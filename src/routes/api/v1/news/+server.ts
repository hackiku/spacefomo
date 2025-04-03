// src/routes/api/v1/news/+server.ts
import { json } from '@sveltejs/kit';
import { getNewsItems } from '$lib/services/api/newsApiService';

export async function GET({ url }) {
	const limit = parseInt(url.searchParams.get('limit') || '20');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const weekId = url.searchParams.get('weekId') ? parseInt(url.searchParams.get('weekId')!) : null;
	const minScore = parseInt(url.searchParams.get('minScore') || '0');
	const tags = url.searchParams.get('tags')?.split(',') || [];
	const sortBy = url.searchParams.get('sortBy') || 'fomo_score';
	const sortDir = url.searchParams.get('sortDir') || 'desc';

	try {
		const response = await getNewsItems({
			limit,
			offset,
			weekId,
			minScore,
			tags,
			sortBy,
			sortDir
		});

		return json(response);
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}