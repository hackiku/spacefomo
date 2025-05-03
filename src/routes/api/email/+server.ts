// src/routes/api/email/+server.ts
import { json, error } from '@sveltejs/kit';
import { subscribeUser, sendWelcomeEmail } from '$lib/server/email';

export async function POST({ request }) {
	try {
		const { type, email } = await request.json();

		// Validate email
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw error(400, { message: 'Valid email address is required' });
		}

		if (type === 'subscribe') {
			// First subscribe the user
			const subscribeResult = await subscribeUser(email);

			// Send welcome email (only for new or reactivated subscriptions)
			let emailResult = { success: false };

			if (subscribeResult.success &&
				subscribeResult.message !== 'Already subscribed') {
				emailResult = await sendWelcomeEmail(email);
			}

			return json({
				success: subscribeResult.success,
				message: subscribeResult.message,
				emailSent: emailResult.success
			});
		} else {
			throw error(400, { message: 'Invalid email type' });
		}
	} catch (err) {
		console.error('Email API error:', err);

		if (err.status && err.body) {
			throw err;
		}

		throw error(500, { message: 'Unexpected error processing request' });
	}
}