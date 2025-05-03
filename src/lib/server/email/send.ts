// src/lib/server/email/send.ts
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Use your verified domain for the from address
const FROM_EMAIL = 'news@mail.spacefomo.com';  // Use your verified domain

/**
 * Send an email using Resend
 */
export async function sendEmail({
	to,
	subject,
	html,
	text,
	from = FROM_EMAIL  // Default to your verified domain
}: {
	to: string;
	subject: string;
	html: string;
	text: string;
	from?: string;
}): Promise<{ success: boolean; id?: string; error?: any }> {
	if (!resend) {
		console.error('Resend client not initialized');
		return { success: false, error: 'Resend not configured' };
	}

	try {
		console.log(`Sending email to ${to} with subject "${subject}" from ${from}`);

		const { data, error } = await resend.emails.send({
			from,  // Use the from parameter we set
			to,
			subject,
			html,
			text
		});

		if (error) {
			console.error('Error sending email:', error);
			return { success: false, error };
		}

		console.log(`Email sent successfully. ID: ${data?.id}`);
		return { success: true, id: data?.id };
	} catch (err) {
		console.error('Unexpected error sending email:', err);
		return { success: false, error: err };
	}
}