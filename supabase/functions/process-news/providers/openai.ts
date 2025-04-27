// src/supabase/functions/process-news/providers/openai.ts


import { ExtractionProvider, ExtractionResult } from './index.ts';

// OpenAI extraction provider
export class OpenAIProvider implements ExtractionProvider {
	name = 'openai';
	private apiKey?: string;
	private model: string;
	private promptTemplate: string;
	private systemMessage: string;

	constructor(apiKey?: string, model = 'gpt-4o') {
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

			console.log('OpenAI provider loaded custom prompts');
		} catch (error) {
			console.warn('Using default prompts:', error.message);
		}
	}

	async extract(url: string, options?: any): Promise<ExtractionResult> {
		// Get API key from options, instance, or environment
		const apiKey = options?.apiKey || this.apiKey || Deno.env.get('OPENAI_API_KEY');

		if (!apiKey) {
			throw new Error('OpenAI API key not provided');
		}

		const model = options?.model || this.model;

		// Prepare user message by replacing URL placeholder
		const userMessage = this.promptTemplate.replace('{{url}}', url);

		console.log(`Extracting data from ${url} using OpenAI ${model}`);

		// API call to OpenAI with retry logic
		let retries = 0;
		const maxRetries = 2;

		while (retries <= maxRetries) {
			try {
				const response = await fetch('https://api.openai.com/v1/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${apiKey}`
					},
					body: JSON.stringify({
						model: model,
						messages: [
							{
								role: 'system',
								content: this.systemMessage
							},
							{
								role: 'user',
								content: userMessage
							}
						],
						temperature: 0.3,
						max_tokens: 4000,
						tools: [
							{
								type: "function",
								function: {
									name: "web_browser",
									description: "Browse a webpage and extract information",
									parameters: {
										type: "object",
										properties: {
											url: {
												type: "string",
												description: "The URL to browse"
											}
										},
										required: ["url"]
									}
								}
							}
						],
						tool_choice: "auto"
					})
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`OpenAI API returned status ${response.status}: ${errorText}`);
				}

				const result = await response.json();

				// Handle the response
				const content = result.choices[0].message.content;

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
					console.error('Failed to parse JSON from OpenAI response:', error);
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
ProviderFactory.register(new OpenAIProvider());