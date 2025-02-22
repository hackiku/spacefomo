// src/routes/admin/+page.server.ts
import { db } from '$lib/db';
import { submissions } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	try {
		const data = await db
			.select()
			.from(submissions)
			.orderBy(desc(submissions.createdAt));

		return {
			submissions: data
		};
	} catch (error) {
		console.error('Failed to load submissions:', error);
		return {
			submissions: []
		};
	}
}