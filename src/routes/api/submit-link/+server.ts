// src/routes/api/submit-link/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addNewsItem } from '$lib/server/db/mockDb';
import type { NewsItem } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	const item: NewsItem = await request.json();
	addNewsItem(item);
	return json({ success: true, message: 'Link submitted successfully' });
};
