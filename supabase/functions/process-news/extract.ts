// supabase/functions/process-news/extract.ts

// Load the extraction prompt
let extractionPrompt: string;
try {
	extractionPrompt = Deno.readTextFileSync('./prompts/extraction.json');
} catch (error) {
	console.log('Using default prompt: prompt file not found');
	extractionPrompt = JSON.stringify({
		systemMessage: "You are a space news data extraction system. Extract structured data from the article at the provided URL. Return ONLY JSON without any explanation or markdown formatting.",
		userMessageTemplate: "Visit this URL: {{url}}\n\nExtract structured information from this space news article and return the following JSON structure:\n\n1. Basic article info:\n- title: The article's headline\n- source: The publication source\n- publication_date: When it was published (YYYY-MM-DD)\n- read_time: Estimated read time in minutes\n\n2. \"context\" object with:\n- \"timeline\": Include phase, key dates, and milestones\n- \"market_data\": Any relevant market/industry figures\n- \"related_stories\": Connections to other news\n- \"narrative_thread\": Type of story and stakeholders\n\n3. \"entities\" object with:\n- \"people\": Array of people with name, role, company\n- \"companies\": Array of companies with name and role\n- \"facilities\": Any facilities or locations mentioned\n- \"technologies\": Technologies with name and status\n\n4. Content fields:\n- \"viral_title\": An attention-grabbing title with emoji (max 90 chars)\n- \"summary\": Concise 2-3 sentence summary (max 300 chars)\n- \"tags\": Array of 5-7 relevant tag strings\n\nReturn the complete requested JSON structure with all fields."
	});
}

const prompt = JSON.parse(extractionPrompt);

// Function to extract data from article using Perplexity API
export async function extractArticleData(url: string, apiKey?: string) {
	// Use provided API key or get from environment
	const PERPLEXITY_API_KEY = apiKey || Deno.env.get('PERPLEXITY_API_KEY');

	if (!PERPLEXITY_API_KEY) {
		throw new Error('PERPLEXITY_API_KEY not found in environment variables or parameters');
	}

	try {
		console.log(`Extracting data from URL: ${url} using Perplexity`);

		// Prepare messages
		const systemMessage = prompt.systemMessage;
		const userMessage = prompt.userMessageTemplate.replace('{{url}}', url);

		// Call Perplexity API with retry logic
		let retries = 0;
		const maxRetries = 2;
		let result;

		while (retries <= maxRetries) {
			try {
				const response = await fetch('https://api.perplexity.ai/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
					},
					body: JSON.stringify({
						model: 'sonar',
						messages: [
							{
								role: 'system',
								content: systemMessage
							},
							{
								role: 'user',
								content: userMessage
							}
						],
						temperature: 0.2,
						max_tokens: 4000,
						stream: false
					})
				});

				if (!response.ok) {
					const errorBody = await response.text();
					throw new Error(`Perplexity API returned status code ${response.status}: ${errorBody}`);
				}

				result = await response.json();
				break; // Success, exit retry loop
			} catch (error) {
				retries++;
				if (retries > maxRetries) throw error;
				console.warn(`API call failed, retry attempt ${retries}/${maxRetries}:`, error.message);
				await new Promise(r => setTimeout(r, 1000 * retries)); // Exponential backoff
			}
		}

		if (!result) {
			throw new Error('Failed to get response from Perplexity API after retries');
		}

		// Extract the response content
		const content = result.choices[0].message.content;

		try {
			// Try to extract JSON from the response
			const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
				content.match(/```\n([\s\S]*?)\n```/) ||
				content.match(/{[\s\S]*}/);

			const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
			let extractedData = JSON.parse(jsonString.trim());

			// Normalize the data structure - Perplexity might be using a nested structure
			// with fields like basic_article_info, content_fields, etc.
			const normalizedData = normalizeDataStructure(extractedData);

			// Validate required fields
			if (!normalizedData.title) {
				console.warn('Warning: Extracted data missing title');
				normalizedData.title = 'Untitled Article';
			}

			// Generate a URL slug from the title with a timestamp to avoid duplicates
			const timestamp = new Date().getTime().toString().slice(-4);
			const titleForSlug = normalizedData.viral_title || normalizedData.title;
			normalizedData.slug = `${generateSlug(titleForSlug)}-${timestamp}`;

			console.log(`Generated slug: ${normalizedData.slug}`);

			return normalizedData;
		} catch (error) {
			console.error('Error parsing extracted data JSON:', error);
			console.error('Raw content:', content);
			throw new Error('Failed to parse extracted data from Perplexity response');
		}
	} catch (error) {
		console.error('Error in extractArticleData:', error);
		throw error;
	}
}

// Helper function to normalize the data structure returned by Perplexity
function normalizeDataStructure(data: any): any {
	// Create a normalized object with all our expected fields
	const normalized: any = {
		title: '',
		source: '',
		publication_date: '',
		read_time: 0,
		entities: {},
		context: {},
		viral_title: '',
		summary: '',
		tags: [],
		impact_score: 70, // Default value
		slug: ''
	};

	// Check if data is already in our expected format
	if (data.title && typeof data.title === 'string') {
		// Data is already in the format we expect
		return data;
	}

	// Handle nested structure from Perplexity
	if (data.basic_article_info) {
		normalized.title = data.basic_article_info.title || '';
		normalized.source = data.basic_article_info.source || '';
		normalized.publication_date = data.basic_article_info.publication_date || '';
		normalized.read_time = data.basic_article_info.read_time || 0;
	}

	if (data.entities) {
		normalized.entities = data.entities;
	}

	if (data.context) {
		normalized.context = data.context;
	}

	if (data.content_fields) {
		normalized.viral_title = data.content_fields.viral_title || '';
		normalized.summary = data.content_fields.summary || '';
		normalized.tags = data.content_fields.tags || [];
	}

	// If title is still empty but we have title in other places, use those
	if (!normalized.title) {
		normalized.title = data.title || normalized.viral_title || 'Untitled Article';
	}

	// If tags isn't an array, make it one
	if (!Array.isArray(normalized.tags)) {
		normalized.tags = normalized.tags ? [normalized.tags] : [];
	}

	// Ensure we have at least some tags
	if (normalized.tags.length === 0 && normalized.title) {
		const words = normalized.title.split(' ');
		normalized.tags = words.filter(word => word.length > 3).slice(0, 5);
	}

	// Log the normalized structure
	console.log('Normalized data structure:', JSON.stringify(normalized, null, 2));

	return normalized;
}

// Generate a slug from a title
function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special characters and emojis
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with a single one
		.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
		.substring(0, 70); // Limit length (shorter to accommodate timestamp)
}