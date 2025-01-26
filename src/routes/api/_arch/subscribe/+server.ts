// src/routes/api/subscribe/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email } = await request.json();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      return json({ error: 'Invalid email' }, { status: 400 });
    }

    // Prepare webhook payload
    const payload = {
      email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      source: 'spacefomo_web',
      // Optional: Add any additional fields Make.com might need
      tags: ['space_news', 'tech_updates'],
      subscriptionType: 'weekly_digest'
    };

    // Send to Make.com webhook
    const webhookResponse = await fetch('MAKE_SUBSCRIBE_WEBHOOK_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!webhookResponse.ok) {
      throw new Error('Webhook failed');
    }

    return json({ success: true });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
