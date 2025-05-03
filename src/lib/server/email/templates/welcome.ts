// src/lib/server/email/templates/welcome.ts

/**
 * Generate a welcome email for new subscribers
 */
export function generateWelcomeEmail(email: string): {
	subject: string;
	html: string;
	text: string;
} {
	const subject = 'Welcome to SpaceFomo! 🚀';

	// Plain text version
	const text = `
Welcome to SpaceFomo!

Thanks for subscribing to SpaceFomo, the best place to get concise space news - all in ~100 words a pop.

You'll receive our space news directly in your inbox. We respect your time, so we'll only send you the most important updates.

If you have any questions or feedback, feel free to reply to this email.

To the stars!
The SpaceFomo Team
`;

	// HTML version
	const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #f8f9fa;
      background-color: #111827;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #a78bfa;
      margin-bottom: 5px;
    }
    .tagline {
      font-size: 16px;
      color: #a78bfa;
      opacity: 0.8;
    }
    .content {
      background-color: #1f2937;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
      color: #f3f4f6;
    }
    p {
      margin-bottom: 15px;
      color: #d1d5db;
    }
    .button {
      display: inline-block;
      background: linear-gradient(to right, #8b5cf6, #d946ef);
      color: white;
      padding: 12px 24px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: bold;
      margin: 15px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    .social-links {
      margin-bottom: 15px;
    }
    .social-link {
      display: inline-block;
      margin: 0 10px;
      color: #a78bfa;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SpaceFomo</div>
      <div class="tagline">Hot Space News ~100 Words a Pop</div>
    </div>
    
    <div class="content">
      <h1>Welcome to SpaceFomo! 🚀</h1>
      
      <p>Thanks for subscribing to SpaceFomo, the best place to get concise space news - all in ~100 words a pop.</p>
      
      <p>You'll receive our space news directly in your inbox. We respect your time, so we'll only send you the most important updates.</p>
      
      <p>If you have any questions or feedback, feel free to reply to this email.</p>
      
      <p>To the stars!<br>The SpaceFomo Team</p>
      
      <a href="https://spacefomo.com/news" class="button">Check Out Latest News</a>
    </div>
    
    <div class="footer">
      <div class="social-links">
        <a href="https://twitter.com/spacefomo" class="social-link">Twitter</a>
        <a href="https://github.com/spacefomo" class="social-link">GitHub</a>
      </div>
      
      <p>© 2025 SpaceFomo. All rights reserved.</p>
      <p>You're receiving this email because you signed up for updates from SpaceFomo.</p>
      <p><a href="https://spacefomo.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9ca3af;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
  `;

	return { subject, html, text };
}