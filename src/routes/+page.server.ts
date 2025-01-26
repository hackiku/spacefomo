// src/routes/+page.server.ts
import { getNewsItems } from '$lib/server/notion';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const news = await getNewsItems();
	return { news };
};