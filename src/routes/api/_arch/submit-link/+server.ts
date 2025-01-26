// src/routes/api/submit-link/+server.ts

import { json } from '@sveltejs/kit';
import { mockDb } from '$lib/server/db/mockDb';

export async function POST({ request }) {
	try {
		const { url } = await request.json();
		await mockDb.submitLink(url);
		return json({ success: true });
	} catch (error) {
		return json({ success: false, error: 'Failed to submit link' }, { status: 400 });
	}
}