// src/lib/server/notion.ts
import { NOTION_API_KEY, NOTION_DATABASE_ID } from '$env/static/private';
import { createClient } from '@notionhq/client';
import { dev } from '$app/environment';

const notion = createClient({ auth: NOTION_API_KEY });

// Cache news items with a TTL
let newsCache: any[] = [];
let lastFetch = 0;
const CACHE_TTL = dev ? 1000 * 60 : 1000 * 60 * 15; // 1 min dev, 15 min prod

export async function getNewsItems() {
	if (Date.now() - lastFetch < CACHE_TTL) {
		return newsCache;
	}

	const response = await notion.databases.query({
		database_id: NOTION_DATABASE_ID,
		sorts: [{ property: 'Date', direction: 'desc' }]
	});

	newsCache = response.results.map(mapNotionToNews);
	lastFetch = Date.now();
	return newsCache;
}