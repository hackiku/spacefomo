// src/routes/api/import-news/+server.ts
import { json } from '@sveltejs/kit';
import { createNewsItem } from '$lib/server/notion';
import type { RequestHandler } from './$types';
import type { NewsItem } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const items: NewsItem[] = await request.json();

		// Process each item
		const results = await Promise.all(
			items.map(async (item) => {
				try {
					// Format dataPoints as JSON string if they exist
					const dataPointsString = item.dataPoints
						? JSON.stringify(item.dataPoints)
						: null;

					await createNewsItem({
						title: item.title,
						url: item.url,
						summary: item.summary,
						type: item.type,
						source: item.source,
						tags: item.tags,
						readTime: item.readTime,
						score: item.score,
						dataPoints: dataPointsString
					});

					return { success: true, title: item.title };
				} catch (error) {
					console.error('Failed to import item:', item.title, error);
					return { success: false, title: item.title, error };
				}
			})
		);

		return json({
			success: true,
			imported: results.filter(r => r.success).length,
			failed: results.filter(r => !r.success).length,
			details: results
		});
	} catch (error) {
		console.error('Import failed:', error);
		return json({ success: false, error: 'Import failed' }, { status: 500 });
	}
};