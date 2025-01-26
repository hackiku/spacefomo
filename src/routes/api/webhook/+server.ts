// src/routes/api/webhook/+server.ts

import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

interface SubscribePayload {
	email: string;
	type: 'subscribe';
}

interface SubmitNewsPayload {
	url: string;
	comment?: string;
	fomoScore?: number;
	type: 'submit-news';
}

type WebhookPayload = SubscribePayload | SubmitNewsPayload;

// Dev logging helper
function logPayload(action: string, payload: any) {
	if (dev) {
		console.log(`\n🚀 SpaceFOMO Webhook - ${action}`);
		console.log('Timestamp:', new Date().toISOString());
		console.log('Payload:', JSON.stringify(payload, null, 2));
		console.log('------------------------\n');
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = await request.json() as WebhookPayload;
		const basePayload = {
			timestamp: new Date().toISOString(),
			userAgent: request.headers.get('user-agent'),
			source: 'spacefomo_web'
		};

		switch (payload.type) {
			case 'subscribe': {
				// Validate email
				if (!payload.email?.includes('@')) {
					return json({ error: 'Invalid email' }, { status: 400 });
				}

				const subscribePayload = {
					...basePayload,
					...payload,
					tags: ['space_news', 'tech_updates'],
					subscriptionType: 'weekly_digest'
				};

				logPayload('Email Subscription', subscribePayload);

				if (!dev) {
					// TODO: Add Make.com webhook call here
					// await fetch(MAKE_SUBSCRIBE_WEBHOOK_URL, {...})
				}

				return json({ success: true, dev });
			}

			case 'submit-news': {
				// Validate URL
				if (!payload.url?.startsWith('http')) {
					return json({ error: 'Invalid URL' }, { status: 400 });
				}

				// Validate FOMO score if provided
				if (payload.fomoScore !== undefined &&
					(payload.fomoScore < 0 || payload.fomoScore > 100)) {
					return json({ error: 'FOMO score must be between 0 and 100' },
						{ status: 400 });
				}

				const newsPayload = {
					...basePayload,
					...payload,
					comment: payload.comment || null,
					fomoScore: payload.fomoScore || null
				};

				logPayload('News Submission', newsPayload);

				if (!dev) {
					// TODO: Add Make.com webhook call here
					// await fetch(MAKE_SUBMIT_WEBHOOK_URL, {...})
				}

				return json({ success: true, dev });
			}

			default:
				return json(
					{ error: 'Invalid webhook type' },
					{ status: 400 }
				);
		}

	} catch (error) {
		console.error('Webhook error:', error);
		return json(
			{ error: 'Internal server error', details: dev ? error : undefined },
			{ status: 500 }
		);
	}
};