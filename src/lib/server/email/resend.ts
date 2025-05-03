// src/lib/server/email/resend.ts
import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_AUDIENCE_ID } from '$env/static/private';

// Initialize Resend client
let resend: Resend | null = null;
if (RESEND_API_KEY) {
    resend = new Resend(RESEND_API_KEY);
} else {
    console.error('RESEND_API_KEY is not configured in .env');
}

// Add a subscriber to audience
export async function addSubscriberToResend(email: string): Promise<boolean> {
    if (!resend || !RESEND_AUDIENCE_ID) {
        console.error('Resend client or Audience ID not available');
        return false;
    }

    try {
        console.log(`Adding contact ${email} to audience ${RESEND_AUDIENCE_ID}`);
        
        const { data, error } = await resend.contacts.create({
            email,
            audienceId: RESEND_AUDIENCE_ID,
            unsubscribed: false
        });

        if (error) {
            // Handle duplicate error gracefully
            if (error.name === 'validation_error' && 
                error.message?.toLowerCase().includes('already exists')) {
                return true;
            }
            console.error('Resend API error:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error:', err);
        return false;
    }
}

// Send an email
export async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
    if (!resend) {
        console.error('Resend client not available');
        return false;
    }

    try {
        const { data, error } = await resend.emails.send({
            to,
            subject,
            html,
            text,
            // No need to specify "from" - Resend will use your default sender
        });

        if (error) {
            console.error('Error sending email:', error);
            return false;
        }
        
        console.log(`Email sent successfully. ID: ${data?.id}`);
        return true;
    } catch (err) {
        console.error('Unexpected error sending email:', err);
        return false;
    }
}

// Update subscriber status
export async function updateSubscriberStatus(
    email: string, 
    unsubscribe: boolean = false
): Promise<boolean> {
    if (!resend || !RESEND_AUDIENCE_ID) {
        console.error('Resend client or Audience ID not available');
        return false;
    }

    try {
        // Find contact
        const { data: contacts, error: findError } = await resend.contacts.list({
            audienceId: RESEND_AUDIENCE_ID,
            email
        });

        if (findError || !contacts || contacts.length === 0) {
            console.error('Error finding contact in Resend:', findError || 'Not found');
            return false;
        }

        // Update contact
        const { error: updateError } = await resend.contacts.update({
            audienceId: RESEND_AUDIENCE_ID,
            id: contacts[0].id,
            unsubscribed: unsubscribe
        });

        if (updateError) {
            console.error('Error updating contact:', updateError);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error:', err);
        return false;
    }
}