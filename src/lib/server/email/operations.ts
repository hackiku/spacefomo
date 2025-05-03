// src/lib/server/email/operations.ts
import { supabase } from '$lib/server/supabase/client';
import { addSubscriberToResend, sendEmail, updateSubscriberStatus } from './resend';
import { generateWelcomeEmail } from './templates/welcome';
import { generateNewsSharedEmail } from './templates/news-shared';
import type { Submission } from '$lib/types/submission';

// Handle subscription and welcome email
export async function subscribeUser(email: string): Promise<{
	success: boolean;
	message: string;
	alreadySubscribed: boolean;
	emailSent: boolean;
}> {
	// Check for existing subscriber
	const { data: existingSubscriber, error: checkError } = await supabase
		.from('subscribers')
		.select('id, status')
		.eq('email', email)
		.single();

	let alreadySubscribed = false;

	// Handle existing subscriber
	if (!checkError && existingSubscriber) {
		alreadySubscribed = true;
		console.log(`Email ${email} already exists`);

		// Reactivate if unsubscribed
		if (existingSubscriber.status === 'unsubscribed') {
			const { error: updateError } = await supabase
				.from('subscribers')
				.update({
					status: 'active',
					updated_at: new Date().toISOString()
				})
				.eq('id', existingSubscriber.id);

			if (updateError) {
				console.error('Error reactivating subscriber:', updateError);
				return {
					success: false,
					message: 'Failed to reactivate subscription',
					alreadySubscribed: true,
					emailSent: false
				};
			}
		} else {
			// Already active
			return {
				success: true,
				message: 'Already subscribed',
				alreadySubscribed: true,
				emailSent: false
			};
		}
	}
	// Add new subscriber
	else if (checkError && checkError.code === 'PGRST116') {
		const { error: insertError } = await supabase
			.from('subscribers')
			.insert({
				email,
				status: 'active',
				created_at: new Date().toISOString()
			});

		if (insertError) {
			console.error('Error adding subscriber:', insertError);
			return {
				success: false,
				message: 'Failed to add subscription',
				alreadySubscribed: false,
				emailSent: false
			};
		}
	}
	// Other errors
	else {
		console.error('Error checking subscriber:', checkError);
		return {
			success: false,
			message: 'Error checking subscription status',
			alreadySubscribed: false,
			emailSent: false
		};
	}

	// Add to Resend
	const resendResult = await addSubscriberToResend(email);
	if (!resendResult) {
		console.error('Failed to add to Resend audience:', email);
	}

	// Send welcome email
	let emailSent = false;
	const shouldSendWelcome = !alreadySubscribed || (existingSubscriber?.status === 'unsubscribed');

	if (shouldSendWelcome) {
		const { subject, html, text } = generateWelcomeEmail(email);
		emailSent = await sendEmail(email, subject, html, text);
	}

	return {
		success: true,
		message: alreadySubscribed ? 'Subscription reactivated' : 'Subscription successful',
		alreadySubscribed,
		emailSent
	};
}

// Send confirmation for news submission
export async function sendNewsConfirmation(email: string, submission: Submission): Promise<boolean> {
	const { subject, html, text } = generateNewsSharedEmail(email, submission);
	return await sendEmail(email, subject, html, text);
}

// Handle unsubscribe
export async function unsubscribeUser(email: string): Promise<{
	success: boolean;
	message: string;
}> {
	// Update Supabase
	const { error: updateError } = await supabase
		.from('subscribers')
		.update({
			status: 'unsubscribed',
			updated_at: new Date().toISOString()
		})
		.eq('email', email);

	if (updateError) {
		console.error('Error updating subscriber status:', updateError);
		return {
			success: false,
			message: 'Failed to update subscription'
		};
	}

	// Update Resend
	const resendResult = await updateSubscriberStatus(email, true);
	if (!resendResult) {
		console.error('Failed to update Resend status:', email);
	}

	return {
		success: true,
		message: 'Successfully unsubscribed'
	};
}