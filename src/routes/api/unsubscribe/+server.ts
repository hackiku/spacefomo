// src/routes/api/unsubscribe/+server.ts
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase/client';
import { updateSubscriberStatusInResend } from '$lib/server/email';

export async function POST({ request }) {
	try {
		const { email } = await request.json();

		// Validate email format
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw error(400, { message: 'Valid email address is required' });
		}

		// First, check if the subscriber exists
		const { data: existingSubscriber, error: checkError } = await supabase
			.from('subscribers')
			.select('id, status')
			.eq('email', email)
			.single();

		if (checkError) {
			// If not found, return an appropriate message
			if (checkError.code === 'PGRST116') {
				return json({
					success: false,
					message: 'Email not found in our subscriber list'
				});
			}

			console.error('Error checking for existing subscriber:', checkError);
			throw error(500, { message: 'Error checking subscription status' });
		}

		// If already unsubscribed, just return success
		if (existingSubscriber.status === 'unsubscribed') {
			return json({
				success: true,
				message: 'Already unsubscribed'
			});
		}

		// Update the status in Supabase
		const { error: updateError } = await supabase
			.from('subscribers')
			.update({
				status: 'unsubscribed',
				updated_at: new Date().toISOString()
			})
			.eq('id', existingSubscriber.id);

		if (updateError) {
			console.error('Error updating subscriber status:', updateError);
			throw error(500, { message: 'Failed to update subscription status' });
		}

		// Update in Resend as well
		let resendUpdated = false;

		try {
			resendUpdated = await updateSubscriberStatusInResend(email, true);

			if (!resendUpdated) {
				console.error('Failed to update subscription status in Resend:', email);
			} else {
				console.log(`Successfully updated subscription status for ${email} in Resend`);
			}
		} catch (resendErr) {
			console.error('Error updating Resend subscription:', resendErr);
			// Don't fail the overall operation if Resend update fails
		}

		return json({
			success: true,
			message: 'Successfully unsubscribed',
			resendUpdated
		});
	} catch (err) {
		console.error('Unsubscribe API endpoint error:', err);

		if (err.status && err.body) {
			throw err;
		}

		throw error(500, { message: 'Unexpected error processing unsubscribe request' });
	}
}

// Also handle GET requests for unsubscribe links in emails
export async function GET({ url }) {
	try {
		const email = url.searchParams.get('email');

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return new Response('Invalid email address', { status: 400 });
		}

		// Update the status in Supabase
		const { error: updateError } = await supabase
			.from('subscribers')
			.update({
				status: 'unsubscribed',
				updated_at: new Date().toISOString()
			})
			.eq('email', email);

		if (updateError) {
			console.error('Error updating subscriber status:', updateError);
			return new Response('Error unsubscribing. Please try again later.', { status: 500 });
		}

		// Update in Resend as well
		try {
			const resendUpdated = await updateSubscriberStatusInResend(email, true);

			if (!resendUpdated) {
				console.error('Failed to update subscription status in Resend:', email);
			}
		} catch (resendErr) {
			console.error('Error updating Resend subscription:', resendErr);
			// Don't fail the overall operation if Resend update fails
		}

		// Redirect to a confirmation page
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/unsubscribed?success=true'
			}
		});
	} catch (err) {
		console.error('Unsubscribe GET endpoint error:', err);
		return new Response('Error processing unsubscribe request', { status: 500 });
	}
}