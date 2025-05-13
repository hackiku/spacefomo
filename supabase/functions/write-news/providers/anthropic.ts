// supabase/functions/write-news/providers/anthropic.ts

import { NewsProvider, ProcessOptions, ExtractedData } from './index.ts';
import { fetchUrlContent } from '../utils/content-fetcher.ts';

export interface AnthropicOptions {
	apiKey?: string;
	model?: string;
	maxRetries?: number;
}

export class AnthropicProvider implements NewsProvider {
	private apiKey: string;
	private model: string;
	private maxRetries: number;

	constructor(options: AnthropicOptions = {}) {
		this.apiKey = options.apiKey || Deno.env.get('ANTHROPIC_API_KEY') || '';
		this.model = options.model || 'claude-3-opus-20240229';
		this.maxRetries = options.maxRetries || 2;

		if (!this.apiKey) {
			throw new Error('ANTHROPIC_API_KEY is required');
		}
	}

	async processUrl(url: string, options: ProcessOptions = {}): Promise<ExtractedData> {
		console.log(`Processing URL with Anthropic (Claude): ${url}`);

		// First try to fetch content as plaintext
		let plaintext: string | null = null;
		try {
			plaintext = await fetchUrlContent(url);
			console.log(`Fetched ${plaintext.length} characters of plaintext`);
		} catch (error) {
			console.warn(`Failed to fetch page content: ${error.message}`);
		}

		// Prepare system prompt
		const systemPrompt = "You are a space news data extraction expert. Extract structured data from the article content provided. You will return ONLY valid JSON without any explanation or text outside the JSON.";

		// Prepare user message
		let userMessage = `Extract structured information from this space news article and return a JSON structure with the following fields:

1. Basic article info:
- title: The article's headline
- source: The publication source
- publication_date: When it was published (YYYY-MM-DD)
- read_time: Estimated read time in minutes

2. "context" object with:
- "timeline": Include phase, key dates, and milestones
- "market_data": Any relevant market/industry figures
- "related_stories": Connections to other news
- "narrative_thread": Type of story and stakeholders

3. "entities" object with:
- "people": Array of people with name, role, company
- "companies": Array of companies with name and role
- "facilities": Any facilities or locations mentioned
- "technologies": Technologies with name and status

4. Content fields:
- "viral_title": An attention-grabbing title with emoji (max 90 chars)
- "summary": Concise 2-3 sentence summary (max 300 chars)
- "tags": Array of 5-7 relevant tag strings
- "fomo_score": A number 1-100 rating how interesting this news is

Here's the article URL: ${url}`;

		// Add plaintext if available
		if (plaintext) {
			userMessage += `\n\nI've already fetched the content for you:\n\n${plaintext.substring(0, 15000)}`;
		}

		// Add any context from options
		if (options.title) {
			userMessage += `\n\nThe article title appears to be: ${options.title}`;
		}

		if (options.source) {
			userMessage += `\n\nThe source appears to be: ${options.source}`;
		}

		if (options.publicationDate) {
			userMessage += `\n\nThe publication date appears to be: ${options.publicationDate}`;
		}

		// Call Anthropic API with retry logic
		return await this.callWithRetries(systemPrompt, userMessage, plaintext);
	}

	private async callWithRetries(systemPrompt: string, userMessage: string, plaintext: string | null): Promise<ExtractedData> {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
			try {
				console.log(`API call attempt ${attempt + 1}/${this.maxRetries + 1}`);

				const response = await fetch('https://api.anthropic.com/v1/messages', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-api-key': this.apiKey,
						'anthropic-version': '2023-06-01'
					},
					body: JSON.stringify({
						model: this.model,
						system: systemPrompt,
						messages: [
							{ role: 'user', content: userMessage }
						],
						temperature: 0.2,
						max_tokens: 4000
					})
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
				}

				const result = await response.json();
				const content = result.content[0].text;

				// Parse JSON from the response
				const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
					content.match(/```\n([\s\S]*?)\n```/) ||
					content.match(/{[\s\S]*}/);

				const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
				const data = JSON.parse(jsonString.trim());

				console.log(`Extraction successful with ${Object.keys(data).length} fields`);

				// Normalize data and add plaintext
				return this.normalizeData(data, plaintext);
			} catch (error) {
				console.error(`API call error:`, error);
				lastError = error;

				if (attempt < this.maxRetries) {
					// Exponential backoff
					const backoffMs = Math.pow(2, attempt) * 1000;
					console.log(`Retrying in ${backoffMs}ms...`);
					await new Promise(r => setTimeout(r, backoffMs));
				}
			}
		}

		throw lastError || new Error('Failed to call Anthropic API after all retries');
	}

	private normalizeData(data: any, plaintext: string | null): ExtractedData {
		// Create a normalized object with all our expected fields
		const normalized: ExtractedData = {
			title: '',
			source: '',
			read_time: 0,
			fomo_score: 70,
			tags: [],
			entities: {},
			context: {},
			impact_score: 70,
			publication_date: '',
			viral_title: '',
			summary: '',
			plaintext: plaintext || null
		};

		// Check if data is already in our expected format
		if (data.title && typeof data.title === 'string') {
			// Directly map fields when possible
			normalized.title = data.title;
			normalized.source = data.source || '';
			normalized.read_time = data.read_time || 3;
			normalized.fomo_score = data.fomo_score || 70;
			normalized.entities = data.entities || {};
			normalized.context = data.context || {};
			normalized.impact_score = data.impact_score || 60;
			normalized.publication_date = data.publication_date || '';
			normalized.viral_title = data.viral_title || '';
			normalized.summary = data.summary || '';
			normalized.tags = Array.isArray(data.tags) ? data.tags : [];

			return normalized;
		}

		// Handle nested structure if needed (similar to Perplexity provider)
		if (data.basic_article_info) {
			normalized.title = data.basic_article_info.title || '';
			normalized.source = data.basic_article_info.source || '';
			normalized.publication_date = data.basic_article_info.publication_date || '';
			normalized.read_time = data.basic_article_info.read_time || 3;
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
			normalized.fomo_score = data.content_fields.fomo_score || 70;
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

		return normalized;
	}
}