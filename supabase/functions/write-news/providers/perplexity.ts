// supabase/functions/write-news/providers/perplexity.ts

import { NewsProvider, ProcessOptions, ExtractedData } from './index.ts';
import { fetchUrlContent } from '../utils/content-fetcher.ts';

export interface PerplexityOptions {
	apiKey?: string;
	model?: string;
	maxRetries?: number;
}

export class PerplexityProvider implements NewsProvider {
	private apiKey: string;
	private model: string;
	private maxRetries: number;

	constructor(options: PerplexityOptions = {}) {
		this.apiKey = options.apiKey || Deno.env.get('PERPLEXITY_API_KEY') || '';
		this.model = options.model || 'sonar';
		this.maxRetries = options.maxRetries || 2;

		if (!this.apiKey) {
			throw new Error('PERPLEXITY_API_KEY is required');
		}
	}

	async processUrl(url: string, options: ProcessOptions = {}): Promise<ExtractedData> {
		console.log(`Processing URL with Perplexity: ${url}`);

		// First try to fetch content as plaintext
		let plaintext: string | null = null;
		try {
			plaintext = await fetchUrlContent(url);
			console.log(`Fetched ${plaintext.length} characters of plaintext`);
		} catch (error) {
			console.warn(`Failed to fetch page content: ${error.message}`);
		}

		// Load the extraction prompt
		let extractionPrompt: any;
		try {
			const promptText = await Deno.readTextFile('./prompts/extraction.json');
			extractionPrompt = JSON.parse(promptText);
		} catch (error) {
			console.log('Using default prompt: prompt file not found');
			extractionPrompt = {
				systemMessage: "You are a space news data extraction system. Extract structured data from the article at the provided URL. Return ONLY JSON without any explanation or markdown formatting.",
				userMessageTemplate: "Visit this URL: {{url}}\n\nExtract structured information from this space news article and return the following JSON structure:\n\n1. Basic article info:\n- title: The article's headline\n- source: The publication source\n- publication_date: When it was published (YYYY-MM-DD)\n- read_time: Estimated read time in minutes\n\n2. \"context\" object with:\n- \"timeline\": Include phase, key dates, and milestones\n- \"market_data\": Any relevant market/industry figures\n- \"related_stories\": Connections to other news\n- \"narrative_thread\": Type of story and stakeholders\n\n3. \"entities\" object with:\n- \"people\": Array of people with name, role, company\n- \"companies\": Array of companies with name and role\n- \"facilities\": Any facilities or locations mentioned\n- \"technologies\": Technologies with name and status\n\n4. Content fields:\n- \"viral_title\": An attention-grabbing title with emoji (max 90 chars)\n- \"summary\": Concise 2-3 sentence summary (max 300 chars)\n- \"tags\": Array of 5-7 relevant tag strings\n- \"fomo_score\": A number 1-100 rating how interesting this news is\n\nReturn the complete requested JSON structure with all fields."
			};
		}

		// Prepare user message
		let userMessage = extractionPrompt.userMessageTemplate
			.replace('{{url}}', url);

		// Add plaintext if available
		if (plaintext) {
			userMessage += `\n\nI've already fetched the content for you:\n\n${plaintext.substring(0, 12000)}`;
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

		// Call Perplexity API with retry logic
		return await this.callWithRetries(extractionPrompt.systemMessage, userMessage, plaintext);
	}

	private async callWithRetries(systemMessage: string, userMessage: string, plaintext: string | null): Promise<ExtractedData> {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
			try {
				console.log(`API call attempt ${attempt + 1}/${this.maxRetries + 1}`);

				const response = await fetch('https://api.perplexity.ai/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${this.apiKey}`
					},
					body: JSON.stringify({
						model: this.model,
						messages: [
							{ role: 'system', content: systemMessage },
							{ role: 'user', content: userMessage }
						],
						temperature: 0.2,
						max_tokens: 4000,
						stream: false
					})
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
				}

				const result = await response.json();
				const content = result.choices[0].message.content;

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

		throw lastError || new Error('Failed to call Perplexity API after all retries');
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

		// Handle nested structure
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