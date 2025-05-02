// src/routes/api/email/+server.ts
import { json, error } from '@sveltejs/kit';

export async function POST({ request, fetch }) {
	try {
		const { type, email } = await request.json();

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw error(400, { message: 'Valid email address is required' });
		}

		if (type !== 'subscribe') {
			throw error(400, { message: 'Invalid email type' });
		}

		// Direct integration with Resend API
		// This will work with the Vercel integration
		const RESEND_API_KEY = process.env.RESEND_API_KEY;

		if (!RESEND_API_KEY) {
			console.warn('RESEND_API_KEY not configured');
			// For development, just return success without sending
			return json({ success: true, dev: true });
		}

		// In production, this will actually send the email
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: 'SpaceFomo <subscriptions@yourverifieddomain.com>', // Use your verified domain
				to: [email],
				subject: 'Welcome to SpaceFomo!',
				html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #18181b; color: #f4f4f5;">
            <h1 style="color: #8b5cf6;">Welcome to SpaceFomo! 🚀</h1>
            <p>Thanks for joining the SpaceFomo crew. You'll now receive the latest space news and updates delivered directly to your inbox.</p>
            <p>Stay tuned for your first dispatch from the cosmos!</p>
            <div style="margin-top: 30px; border-top: 1px solid #3f3f46; padding-top: 15px; font-size: 12px; color: #a1a1aa;">
              <p>If you didn't subscribe to SpaceFomo, you can safely ignore this email.</p>
            </div>
          </div>
        `,
			}),
		});

		if (!response.ok) {
			const resendError = await response.json();
			console.error('Resend API error:', resendError);
			throw error(500, { message: 'Failed to send email' });
		}

		return json({ success: true });
	} catch (err) {
		console.error('Email API error:', err);
		if (err.status && err.body) {
			throw error(err.status, err.body.message || 'Email request failed');
		}
		throw error(500, { message: 'Unexpected error processing email request' });
	}
}