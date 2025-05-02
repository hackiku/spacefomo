// src/routes/api/email/+server.ts
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase/client';

// Example function - in production, integrate with Resend or similar service
async function sendEmail(to: string, templateName: string, data: Record<string, any>) {
	try {
		// In production, replace with actual Resend implementation
		// Example:
		// const response = await resend.emails.send({
		//   from: 'SpaceFomo <notifications@spacefomo.com>',
		//   to: [to],
		//   subject: templateSubjects[templateName],
		//   react: renderReactEmail(templateName, data),
		// });

		// Placeholder for mock implementation
		console.log(`Email sent to ${to}`, templateName, data);
		return { success: true, id: `mock-${Date.now()}` };
	} catch (err) {
		console.error('Failed to send email:', err);
		throw new Error('Email sending failed');
	}
}

export async function POST({ request }) {
	try {
		const { type, email, data = {} } = await request.json();

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw error(400, { message: 'Valid email address is required' });
		}

		let templateName = '';

		// Handle different email types
		switch (type) {
			case 'subscribe':
				templateName = 'welcome';

				// Store in Supabase
				const { error: dbError } = await supabase
					.from('subscribers')
					.insert({
						email,
						status: 'pending',
						created_at: new Date().toISOString()
					});

				if (dbError) throw new Error('Failed to store subscription');
				break;

			case 'share_confirmation':
				templateName = 'share_confirmation';
				break;

			default:
				throw error(400, { message: 'Invalid email type' });
		}

		// Send email
		await sendEmail(email, templateName, data);

		return json({ success: true });
	} catch (err) {
		console.error('Email API error:', err);
		if (err.status && err.body) {
			throw error(err.status, err.body.message || 'Email request failed');
		}
		throw error(500, { message: 'Unexpected error processing email request' });
	}
}