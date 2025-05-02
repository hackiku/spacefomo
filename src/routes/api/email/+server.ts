// src/routes/api/email/+server.ts
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase/client';
import { addSubscriberToResend } from '$lib/server/email';

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

		let resendAttempted = false;
		let resendSuccess = false;

		// Store the subscription in Supabase
		const { error: dbError } = await supabase
			.from('subscribers')
			.insert({
				email,
				status: 'active',
				created_at: new Date().toISOString()
			});

		if (dbError) {
			console.error('Supabase error adding subscriber:', dbError);

			// Handle duplicate emails gracefully
			if (dbError.code === '23505') { // PostgreSQL unique violation error
				console.log(`Email ${email} already exists in Supabase. Attempting to ensure it's in Resend.`);
				// Even if already in database, still try to add/ensure presence in Resend
				resendAttempted = true; // Mark that we tried
				resendSuccess = await addSubscriberToResend(email); // Capture the result

				if (!resendSuccess) {
					console.error('Failed attempt to add existing Supabase subscriber to Resend:', email);
				} else {
					console.log(`Ensured existing Supabase subscriber ${email} is present in Resend.`);
				}

				// Return success, indicating they are subscribed (in Supabase), and include Resend status
				return json({
					success: true,
					message: 'Already subscribed',
					resendIntegrated: resendSuccess // Include Resend status here too
				});
			}

			// For other Supabase errors, throw
			throw error(500, { message: 'Failed to save subscription to database' });
		}

		// If Supabase insert was successful, add to Resend
		console.log(`Successfully added ${email} to Supabase. Now adding to Resend...`);
		resendAttempted = true; // Mark that we tried
		resendSuccess = await addSubscriberToResend(email);

		// Log success or failure, but don't fail the request if Resend fails
		if (!resendSuccess) {
			console.error('Failed to add new Supabase subscriber to Resend:', email);
		} else {
			console.log(`Successfully added new Supabase subscriber ${email} to Resend.`);
		}

		// Return success response
		return json({
			success: true,
			message: 'Subscription successful',
			resendIntegrated: resendSuccess // Include Resend status
		});

	} catch (err) {
		// Catch errors thrown by error() or unexpected errors
		console.error('Subscription API endpoint error:', err);

		// If it's an error thrown by SvelteKit's error(), re-throw it
		if (err.status && err.body) {
			// No need to create a new error object, just throw the original
			throw err;
		}

		// For completely unexpected errors
		throw error(500, { message: 'Unexpected error processing subscription' });
	}
}