// src/routes/api/email/+server.ts
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase/client';

export async function POST({ request }) {
	try {
		const { type, email } = await request.json();

		// Validate email format
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw error(400, { message: 'Valid email address is required' });
		}

		// Validate request type
		if (type !== 'subscribe') {
			throw error(400, { message: 'Invalid email type' });
		}

		// Store the subscription in Supabase
		const { error: dbError } = await supabase
			.from('subscribers')
			.insert({
				email,
				status: 'active',
				created_at: new Date().toISOString()
			});

		if (dbError) {
			console.error('Supabase error:', dbError);

			// Handle duplicate emails gracefully
			if (dbError.code === '23505') { // PostgreSQL unique violation error
				return json({
					success: true,
					message: 'Already subscribed'
				});
			}

			throw error(500, { message: 'Failed to save subscription' });
		}

		// Return success response
		return json({
			success: true,
			message: 'Subscription successful'
		});
	} catch (err) {
		console.error('Subscription API error:', err);

		if (err.status && err.body) {
			throw error(err.status, err.body.message || 'Subscription failed');
		}

		throw error(500, { message: 'Unexpected error processing subscription' });
	}
}