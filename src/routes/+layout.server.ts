// src/routes/+layout.server.ts
import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';

export async function load(event) {
	try {
		// Create a tRPC caller
		const trpc = createCaller(await createContext(event));

		// Fetch both types of news in parallel
		const [newsData, processedNewsData] = await Promise.all([
			trpc.getNews({
				limit: 50,
				minScore: 0,
				processed: false
			}),
			trpc.getNews({
				limit: 50,
				minScore: 0,
				processed: true
			})
		]);

		return {
			news: newsData.items,
			processedNews: processedNewsData.items,
			debug: {
				success: true,
				newsCount: newsData.items.length,
				processedNewsCount: processedNewsData.items.length
			}
		};
	} catch (error) {
		console.error('Data fetch error:', error);
		return {
			news: [],
			processedNews: [],
			debug: { error: 'Fetch failed', details: String(error) }
		};
	}
}