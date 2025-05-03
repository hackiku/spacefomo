// src/routes/api/email-preview/+server.ts
import { error } from '@sveltejs/kit';
import { DEV } from '$app/environment';
import { generateWelcomeEmail } from '$lib/server/email/templates/welcome';
import { generateNewsSharedEmail } from '$lib/server/email/templates/news-shared';

export async function GET({ url }) {
	// Only allow in development
	if (!DEV) {
		throw error(403, 'Email preview only available in development mode');
	}

	const type = url.searchParams.get('type') || 'welcome';
	const email = url.searchParams.get('email') || 'test@example.com';

	try {
		let template;

		if (type === 'welcome') {
			template = generateWelcomeEmail(email);
		} else if (type === 'news-shared') {
			// Create a mock submission for preview
			const mockSubmission = {
				id: 123456789,
				url: 'https://example.com/space-news',
				comment: 'This looks interesting!',
				fomo_score: 85,
				email,
				published: false,
				created_at: new Date().toISOString(),
				week_id: 1
			};
			template = generateNewsSharedEmail(email, mockSubmission);
		} else {
			throw error(400, `Unknown template type: ${type}`);
		}

		return new Response(template.html, {
			headers: { 'Content-Type': 'text/html' }
		});
	} catch (err) {
		console.error('Email preview error:', err);
		throw error(500, 'Error generating email preview');
	}
}