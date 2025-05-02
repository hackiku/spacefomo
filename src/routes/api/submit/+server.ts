// src/routes/api/submit/+server.ts
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase/client';
import { addSubscriberToResend } from '$lib/server/email';

export async function POST({ request }) {
	try {
		const { url, comment, fomoScore, email } = await request.json();

		// Basic validation
		if (!url || !url.trim()) {
			throw error(400, { message: 'URL is required' });
		}

		// Get current date for timestamp
		const now = new Date().toISOString();

		// Get the current week to associate with the submission
		const { data: weeks, error: weeksError } = await supabase
			.from('weeks')
			.select('id')
			.order('week_number', { ascending: false })
			.limit(1);

		if (weeksError) {
			console.error('Error fetching current week:', weeksError);
			throw error(500, { message: 'Error fetching current week' });
		}

		const currentWeekId = weeks && weeks.length > 0 ? weeks[0].id : null;

		// Generate submission ID
		const submissionId = Date.now();

		// Insert the submission
		const { data, error: insertError } = await supabase
			.from('submissions')
			.insert({
				id: submissionId,
				url: url.trim(),
				comment: comment?.trim() || null,
				fomo_score: fomoScore || null,
				email: email?.trim() || null,
				week_id: currentWeekId,
				published: false,
				created_at: now
			})
			.select();

		if (insertError) {
			console.error('Error inserting submission:', insertError);
			throw error(500, { message: 'Failed to save submission' });
		}

		// If an email was provided, add it to subscribers table
		let subscriberAdded = false;
		let resendIntegrated = false;

		if (email && email.trim()) {
			const cleanEmail = email.trim();

			// First, check if the subscriber already exists
			const { data: existingSubscriber, error: checkError } = await supabase
				.from('subscribers')
				.select('id')
				.eq('email', cleanEmail)
				.single();

			if (checkError && checkError.code !== 'PGRST116') { // Not a "not found" error
				console.error('Error checking for existing subscriber:', checkError);
			}

			if (existingSubscriber?.id) {
				// Subscriber exists, update the submission_id if it's null
				const { error: updateError } = await supabase
					.from('subscribers')
					.update({
						submission_id: submissionId,
						updated_at: now
					})
					.eq('id', existingSubscriber.id)
					.is('submission_id', null);  // Only update if submission_id is null

				if (updateError) {
					console.error('Error updating subscriber:', updateError);
				} else {
					subscriberAdded = true;
				}
			} else {
				// Subscriber doesn't exist, add them
				const { error: subError } = await supabase
					.from('subscribers')
					.insert({
						email: cleanEmail,
						status: 'active',
						created_at: now,
						submission_id: submissionId
					});

				if (subError) {
					console.error('Error adding subscriber:', subError);
				} else {
					subscriberAdded = true;
				}
			}

			// Add to Resend regardless of whether they're new or existing in our DB
			resendIntegrated = await addSubscriberToResend(cleanEmail);

			if (!resendIntegrated) {
				console.error('Failed to add subscriber to Resend:', cleanEmail);
			}
		}

		return json({
			success: true,
			submission: data[0],
			subscriberAdded,
			resendIntegrated
		});
	} catch (err) {
		console.error('Submission error:', err);
		if (err.status && err.body) {
			throw error(err.status, err.body.message || 'Submission failed');
		}
		throw error(500, { message: 'Unexpected error submitting news' });
	}
}