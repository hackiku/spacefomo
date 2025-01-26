// src/routes/+page.server.ts
import { getNewsItems } from '$lib/server/notion';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const news = await getNewsItems();
		return { news };
	} catch (error) {
		console.error('Failed to load news:', error);
		return {
			news: undefined,
			error: 'Failed to load news items'
		};
	}
};
