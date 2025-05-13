// supabase/functions/research-event/api-clients/perplexity.ts

import { ResearchResult } from '../models/research.ts';

export interface PerplexityAPIOptions {
	apiKey?: string;
	retries?: number;
	model?: string;
}

export class PerplexityClient {
	private apiKey: string;
	private retries: number;
	private model: string;

	constructor(options: PerplexityAPIOptions = {}) {
		this.apiKey = options.apiKey || Deno.env.get('PERPLEXITY_API_KEY') || '';
		this.retries = options.retries || 2;
		this.model = options.model || 'sonar';

		if (!this.apiKey) {
			throw new Error('PERPLEXITY_API_KEY is required');
		}
	}

	async researchRelatedNews(
		title: string,
		url: string,
		entities: any = {}
	): Promise<ResearchResult> {
		const systemMessage = `You are a space news researcher assistant. Your task is to find other news sources reporting on the same event as the original article. Focus on finding primary sources and different perspectives. Return ONLY JSON without any explanation or markdown formatting.`;

		// Extract useful entities for better search
		const companyNames = entities?.companies
			? entities.companies.map((c: any) => c.name).join(', ')
			: '';

		const peopleNames = entities?.people
			? entities.people.map((p: any) => p.name).join(', ')
			: '';

		// Prepare user message
		const userMessage = `Research task: Find different news sources reporting on the same event as this article:
    
Title: ${title}
URL: ${url}
${companyNames ? `Key companies: ${companyNames}` : ''}
${peopleNames ? `Key people: ${peopleNames}` : ''}

Please find 3-5 different news sources that report on this same event. Look for articles from different publications that provide additional perspectives or details.

Return your findings in this exact JSON format:
{
  "meta": {
    "query": "The search query used",
    "original_title": "${title}",
    "original_url": "${url}",
    "found_count": 0
  },
  "sources": [
    {
      "title": "Full title of the article",
      "url": "Full URL to the article",
      "source": "Name of the publication/source",
      "summary": "2-3 sentence summary focusing on unique aspects compared to original",
      "date": "Publication date (YYYY-MM-DD)"
    }
  ]
}

The sources array should ONLY include different articles about the same event, not the original article. Each source must have all fields completed.`;

		// Call API with retry logic
		let lastError: Error | null = null;
		for (let attempt = 0; attempt <= this.retries; attempt++) {
			try {
				const response = await fetch('https://api.perplexity.ai/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${this.apiKey}`
					},
					body: JSON.stringify({
						model: this.model,
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

				const result = await response.json();
				const content = result.choices[0].message.content;

				// Parse the JSON response
				const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
					content.match(/```\n([\s\S]*?)\n```/) ||
					content.match(/{[\s\S]*}/);

				const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
				const extractedData = JSON.parse(jsonString.trim());

				console.log(`Found ${extractedData.sources?.length || 0} related sources`);

				return extractedData;
			} catch (error) {
				lastError = error;

				if (attempt < this.retries) {
					console.warn(`API call failed, retry attempt ${attempt + 1}/${this.retries}:`, error.message);
					// Exponential backoff
					await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
				}
			}
		}

		throw lastError || new Error('Failed to call Perplexity API after retries');
	}
}