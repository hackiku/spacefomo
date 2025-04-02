// src/routes/api/process/extract/+server.ts
import { json } from '@sveltejs/kit';
import { extractContent } from '$lib/server/ai/tasks/extractContent';

export async function POST({ request }) {
	const { url } = await request.json();

	try {
		const content = await extractContent(url);
		return json({ success: true, content });
	} catch (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}
}