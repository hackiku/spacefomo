// src/supabase/functions/process-news/providers/anthropic.ts

import { ExtractionProvider, ExtractionResult } from './index.ts';

// Anthropic (Claude) extraction provider
export class AnthropicProvider implements ExtractionProvider {
	name = 'anthropic';
	private apiKey?: string;
	private model: string;
	private promptTemplate: string;
	private systemMessage: string;

	constructor(apiKey?: string, model = 'claude-3-opus-20240229') {
		this.apiKey = apiKey;
		this.model = model;

		// Set default prompts
		this.systemMessage = "You are a space news data extraction system. Extract structured data from the article at the provided URL. Return ONLY JSON without any explanation or markdown formatting.";
		this.promptTemplate = "Visit this URL: {{url}}";

		// Try to load custom prompts
		this.loadPrompts();
	}

	private loadPrompts() {
		try {
			const promptsText = Deno.readTextFileSync('./prompts/extraction.json');
			const prompts = JSON.parse(promptsText);

			if (prompts.systemMessage) {
				this.systemMessage = prompts.systemMessage;
			}

			if (prompts.userMessageTemplate) {
				this.promptTemplate = prompts.userMessageTemplate;
			}

			console.log('Anthropic provider loaded custom prompts');
		} catch (error) {
			console.warn('Using default prompts:', error.message);
		}
	}

	async extract(url: string, options?: any): Promise<ExtractionResult> {
		// Get API key from options, instance, or environment
		const apiKey = options?.apiKey || this.apiKey || Deno.env.get('ANTHROPIC_API_KEY');

		if (!apiKey) {
			throw new Error('Anthropic API key not provided');
		}

		const model = options?.model || this.model;

		// Prepare message by replacing URL placeholder
		const message = this.promptTemplate.replace('{{url}}', url);

		console.log(`Extracting data from ${url} using Anthropic ${model}`);

		// API call to Anthropic with retry logic
		let retries = 0;
		const maxRetries = 2;

		while (retries <= maxRetries) {
			try {
				const response = await fetch('https://api.anthropic.com/v1/messages', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-API-Key': apiKey,
						'anthropic-version': '2023-06-01'
					},
					body: JSON.stringify({
						model: model,
						messages: [
							{
								role: 'user',
								content: this.systemMessage + "\n\n" + message
							}
						],
						temperature: 0.3,
						max_tokens: 4000,
						system: "You are a helpful assistant that extracts structured data from articles."
					})
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Anthropic API returned status ${response.status}: ${errorText}`);
				}

				const result = await response.json();

				// Handle the response
				const content = result.content[0].text;

				// Extract JSON from content
				try {
					const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
						content.match(/```\n([\s\S]*?)\n```/) ||
						content.match(/{[\s\S]*}/);

					const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
					const extractedData = JSON.parse(jsonString.trim());

					// Generate slug if not present
					if (!extractedData.slug && (extractedData.viral_title || extractedData.title)) {
						extractedData.slug = this.generateSlug(extractedData.viral_title || extractedData.title);
					}

					return extractedData;
				} catch (error) {
					console.error('Failed to parse JSON from Anthropic response:', error);
					console.error('Raw content:', content);
					throw new Error('Failed to parse extracted data');
				}
			} catch (error) {
				retries++;
				if (retries > maxRetries) throw error;

				console.warn(`API call failed, retry attempt ${retries}/${maxRetries}:`, error.message);
				await new Promise(r => setTimeout(r, 1000 * retries)); // Exponential backoff
			}
		}

		throw new Error('Failed to extract data after retries');
	}

	// Helper method to generate a slug from title
	private generateSlug(title: string): string {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '') // Remove special characters and emojis
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with a single one
			.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
			.substring(0, 80); // Limit length
	}
}

// Register this provider
import { ProviderFactory } from './index.ts';
ProviderFactory.register(new AnthropicProvider());

// Uncomment this line to make Anthropic the default provider
// ProviderFactory.setDefaultProvider('anthropic');