// src/routes/+layout.server.ts
import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';

export async function load(event) {
	try {
		// Create a direct caller to your tRPC router (no HTTP, direct function calls)
		const trpc = createCaller(await createContext(event));

		// Call your procedures directly
		const newsData = await trpc.getNews({
			limit: 50,
			minScore: 0
		});

		// You could make multiple calls in parallel
		const processedNewsData = await trpc.getNews({
			limit: 50,
			minScore: 0,
			// You'd need to add a "processed" parameter to your procedure
		});

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