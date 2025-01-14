// src/routes/api/submit-news/+server.ts
import { json } from '@sveltejs/kit';
import { PUBLIC_MAKE_SUBMIT_WEBHOOK_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	try {
		const { url } = await request.json();

		// Basic validation
		if (!url || !url.startsWith('http')) {
			return json({ error: 'Invalid URL' }, { status: 400 });
		}

		// Verify webhook URL is configured
		if (!PUBLIC_MAKE_SUBMIT_WEBHOOK_URL) {
			console.error('Make.com webhook URL not configured');
			return json({ error: 'Server configuration error' }, { status: 500 });
		}

		// Prepare webhook payload
		const payload = {
			url,
			timestamp: new Date().toISOString(),
			userAgent: request.headers.get('user-agent'),
			source: 'spacefomo_web'
		};

		// Send to Make.com webhook using the provided fetch instance
		const webhookResponse = await fetch(PUBLIC_MAKE_SUBMIT_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!webhookResponse.ok) {
			console.error('Webhook failed:', await webhookResponse.text());
			throw new Error('Webhook failed');
		}

		return json({ success: true });

	} catch (error) {
		console.error('Link submission error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};