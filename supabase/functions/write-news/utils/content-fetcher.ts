// supabase/functions/write-news/utils/content-fetcher.ts

/**
 * Fetches and extracts text content from a URL
 */
export async function fetchUrlContent(url: string): Promise<string> {
	try {
		// Make request with appropriate headers
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.9',
				'Cache-Control': 'no-cache'
			},
			redirect: 'follow'
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
		}

		const contentType = response.headers.get('content-type') || '';

		// Only process HTML content
		if (!contentType.includes('text/html')) {
			throw new Error(`Unsupported content type: ${contentType}`);
		}

		// Get the raw HTML
		const html = await response.text();

		// Basic content extraction - this can be enhanced with more sophisticated algorithms
		return extractMainContent(html);
	} catch (error) {
		console.error(`Error fetching URL content: ${error.message}`);
		throw error;
	}
}

/**
 * Extracts the main content from HTML
 * This is a simple implementation that can be improved
 */
function extractMainContent(html: string): string {
	// Remove scripts, styles, and other non-content elements
	let cleanedHtml = html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
		.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
		.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
		.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
		.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');

	// Try to find main content areas
	const contentSelectors = [
		/<article\b[^>]*>([\s\S]*?)<\/article>/gi,
		/<main\b[^>]*>([\s\S]*?)<\/main>/gi,
		/<div\b[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
		/<div\b[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
		/<div\b[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
		/<div\b[^>]*id="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
	];

	let mainContent = '';

	// Try each selector until we find content
	for (const selector of contentSelectors) {
		const matches = [...cleanedHtml.matchAll(selector)];
		if (matches.length > 0) {
			// Use the first match that contains a reasonable amount of text
			for (const match of matches) {
				const content = match[1];
				if (content && content.length > 500) {
					mainContent = content;
					break;
				}
			}

			if (mainContent) break;
		}
	}

	// If no specific content area found, use the whole body
	if (!mainContent) {
		const bodyMatch = /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(cleanedHtml);
		mainContent = bodyMatch ? bodyMatch[1] : cleanedHtml;
	}

	// Convert HTML to plain text
	const plainText = mainContent
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<p\b[^>]*>/gi, '\n')
		.replace(/<\/p>/gi, '\n')
		.replace(/<div\b[^>]*>/gi, '\n')
		.replace(/<\/div>/gi, '\n')
		.replace(/<li\b[^>]*>/gi, '\n• ')
		.replace(/<\/li>/gi, '')
		.replace(/<h[1-6]\b[^>]*>/gi, '\n\n')
		.replace(/<\/h[1-6]>/gi, '\n')
		.replace(/<[^>]*>/g, '') // Remove all remaining HTML tags
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\n{3,}/g, '\n\n') // Normalize spacing
		.trim();

	return plainText;
}