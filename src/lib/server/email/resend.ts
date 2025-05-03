// src/lib/server/email/resend.ts
import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_AUDIENCE_ID } from '$env/static/private'; // Correct SvelteKit import

// Initialize Resend client once. Handle potential missing key.
let resend: Resend | null = null;
if (RESEND_API_KEY) {
	resend = new Resend(RESEND_API_KEY);
} else {
	console.error('RESEND_API_KEY is not configured in .env. Resend integration will be disabled.');
}

if (!RESEND_AUDIENCE_ID) {
	console.error('RESEND_AUDIENCE_ID is not configured in .env. Resend integration will be disabled.');
}

/**
 * Add a subscriber to Resend audience using the Resend SDK.
 * See: https://resend.com/docs/api-reference/contacts/create-contact
 * @param email The email address to add.
 * @returns Promise<boolean> True if the contact was added or likely already exists, false on failure.
 */
export async function addSubscriberToResend(email: string): Promise<boolean> {
	// Check if Resend client or Audience ID are missing
	if (!resend || !RESEND_AUDIENCE_ID) {
		console.error('Resend client or Audience ID not available. Cannot add subscriber.');
		return false;
	}

	try {
		console.log(`Attempting to add contact ${email} to Resend audience ${RESEND_AUDIENCE_ID}...`);

		const { data, error } = await resend.contacts.create({
			email,
			audienceId: RESEND_AUDIENCE_ID,
			unsubscribed: false // Explicitly set subscription status
			// Optional fields you might want to add later if you collect them:
			// firstName: '',
			// lastName: '',
		});

		if (error) {
			// Log the specific error from Resend SDK
			console.error('Resend API error adding contact:', error);

			// Handle potential duplicate contact error gracefully
			// Check if the error indicates the contact already exists.
			// The exact error structure/message might vary, inspect the 'error' object if needed.
			// Example check (adjust based on actual Resend error response for duplicates):
			if (error.name === 'validation_error' && error.message?.toLowerCase().includes('already exists')) {
				console.warn(`Contact ${email} already exists in Resend audience ${RESEND_AUDIENCE_ID}. Treating as success.`);
				return true; // Consider existing contact as a successful operation in this context
			}
			// For other errors, return false
			return false;
		}

		console.log(`Successfully added contact ${email} to Resend audience ${RESEND_AUDIENCE_ID}. Contact ID: ${data?.id}`);
		return true;

	} catch (err) {
		// Catch unexpected errors during the API call execution
		console.error('Unexpected error executing add subscriber to Resend:', err);
		return false;
	}
}