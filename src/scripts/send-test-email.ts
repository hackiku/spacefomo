// src/scripts/send-test-email.ts
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get API key and audience ID from environment
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

// Recipient email - replace with your temp email
const TEST_EMAIL = 'quinterrius.chavira@mailmagnet.co';

// Initialize Resend client
const resend = new Resend(RESEND_API_KEY);

async function sendTestEmail() {
	try {
		console.log('Starting test email send...');

		// First verify the contact exists in the audience
		console.log(`Checking if ${TEST_EMAIL} exists in audience ${RESEND_AUDIENCE_ID}...`);

		const { data: contacts, error: listError } = await resend.contacts.list({
			audienceId: RESEND_AUDIENCE_ID,
			email: TEST_EMAIL
		});

		if (listError) {
			console.error('Error listing contacts:', listError);
			return;
		}

		if (!contacts || contacts.length === 0) {
			console.error(`Contact ${TEST_EMAIL} not found in audience.`);
			return;
		}

		console.log(`Found contact: ${JSON.stringify(contacts[0])}`);

		// Send the test email
		const { data: emailData, error: emailError } = await resend.emails.send({
			from: 'SpaceFomo <news@mail.spacefomo.com>', // Use your verified domain
			to: TEST_EMAIL,
			subject: 'SpaceFomo Test Email Blast',
			html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SpaceFomo Test</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              line-height: 1.5;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #8b5cf6;
            }
            .content {
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(to right, #8b5cf6, #d946ef);
              color: white;
              padding: 10px 20px;
              border-radius: 30px;
              text-decoration: none;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SpaceFomo</div>
          </div>
          
          <div class="content">
            <h1>This is a test email blast</h1>
            
            <p>If you're seeing this email, your Resend integration is working correctly!</p>
            
            <p>This email was sent using your verified domain <strong>mail.spacefomo.com</strong>.</p>
            
            <p>You can use this as a template for future email campaigns.</p>
            
            <p>
              <a href="https://spacefomo.com" class="button">Visit SpaceFomo</a>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 SpaceFomo. All rights reserved.</p>
            <p>This is a test email sent from our development environment.</p>
          </div>
        </body>
        </html>
      `,
			text: `
This is a test email blast.

If you're seeing this email, your Resend integration is working correctly!

This email was sent using your verified domain mail.spacefomo.com.

You can use this as a template for future email campaigns.

Visit SpaceFomo: https://spacefomo.com

© 2025 SpaceFomo. All rights reserved.
This is a test email sent from our development environment.
      `
		});

		if (emailError) {
			console.error('Error sending email:', emailError);
			return;
		}

		console.log('Email sent successfully!');
		console.log('Email ID:', emailData?.id);
	} catch (err) {
		console.error('Unexpected error:', err);
	}
}

// Run the function
sendTestEmail();