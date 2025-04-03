// src/routes/api/v1/news/+server.ts
import { error, json } from '@sveltejs/kit';
import { fetchNews } from '$lib/services/news/newsService';

export async function GET({ url }) {
	const limit = parseInt(url.searchParams.get('limit') || '50');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const tags = url.searchParams.get('tags')?.split(',') || [];
	const weekId = url.searchParams.get('week_id')
		? parseInt(url.searchParams.get('week_id')!)
		: null;
	const minScore = parseInt(url.searchParams.get('min_score') || '0');

	try {
		const result = await fetchNews({
			limit,
			offset,
			tags,
			weekId,
			minScore
		});

		return json({
			data: result.items,
			meta: {
				total: result.total,
				limit,
				offset,
				next: offset + limit < result.total
					? `/api/v1/news?limit=${limit}&offset=${offset + limit}${tags.length ? '&tags=' + tags.join(',') : ''
					}${weekId ? '&week_id=' + weekId : ''}${minScore ? '&min_score=' + minScore : ''
					}`
					: null
			}
		});
	} catch (e) {
		console.error('API error:', e);
		throw error(500, {
			message: e instanceof Error ? e.message : 'Unknown error fetching news'
		});
	}
}