// src/routes/api/process/article/+server.ts
import { json } from '@sveltejs/kit';
import { processArticle } from '$lib/server/ai/index';

export async function POST({ request }) {
	const { url, content, adminProcessed = false } = await request.json();

	try {
		const result = await processArticle({ url, content, adminProcessed });
		return json({ success: true, article: result });
	} catch (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}
}