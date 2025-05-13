// supabase/functions/ingest-research/api-clients/perplexity.ts

import { ResearchRequest, ResearchResult } from '../models/research.ts';

export interface PerplexityOptions {
	apiKey?: string;
	model?: string;
	maxRetries?: number;
}

export class PerplexityClient {
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

	async researchUrl(url: string, title?: string): Promise<ResearchResult> {
		const systemPrompt = `You are a space industry news researcher with deep expertise in the space sector. Your task is to find other news sources reporting on the same event as the original article. Focus on finding primary sources and different perspectives. Return ONLY JSON without any explanation or markdown formatting.`;

		const userPrompt = `Research task: Find different news sources reporting on the same event as this article:
    
URL: ${url}
${title ? `Title: ${title}` : ''}

Find 3-5 different news sources that report on this same specific event. Look for articles from different publications that provide unique perspectives or additional details.

Return your findings in this exact JSON format:
{
  "meta": {
    "query": "The search query you used",
    "original_title": "${title || 'Unknown title'}",
    "original_url": "${url}",
    "found_count": 0,
    "research_type": "url_related"
  },
  "sources": [
    {
      "title": "Full title of the article",
      "url": "Full URL to the article",
      "source": "Name of the publication/source",
      "summary": "2-3 sentence summary focusing on unique aspects",
      "date": "Publication date in YYYY-MM-DD format"
    }
  ]
}

The sources array should ONLY include different articles about the same event, not the original article. Ensure each source is from a different publication than the original.`;

		return this.callPerplexity(systemPrompt, userPrompt);
	}

	async discoverTopicNews(topic: string, timeframe: string = '24h', limit: number = 5): Promise<ResearchResult> {
		const systemPrompt = `You are a space industry news researcher with deep expertise in the space sector. Your task is to discover the most important recent news on a specific topic. Focus on finding high-quality primary sources with significant developments. Return ONLY JSON without any explanation or markdown formatting.`;

		const userPrompt = `Research task: Find the most significant space industry news about "${topic}" from the past ${timeframe}.

Discover ${limit} noteworthy news articles on this topic, prioritizing:
1. Major announcements, breakthroughs, or significant developments
2. Articles from reputable space industry news sources
3. Recent coverage (within the specified timeframe)
4. Diverse perspectives on the topic

Return your findings in this exact JSON format:
{
  "meta": {
    "query": "The search query you used",
    "found_count": 0,
    "research_type": "topic_discovery",
    "topic": "${topic}",
    "timeframe": "${timeframe}"
  },
  "sources": [
    {
      "title": "Full title of the article",
      "url": "Full URL to the article",
      "source": "Name of the publication/source",
      "summary": "2-3 sentence summary of the key points",
      "date": "Publication date in YYYY-MM-DD format"
    }
  ]
}

Ensure each source is from a different publication and represents a significant development in the space industry.`;

		return this.callPerplexity(systemPrompt, userPrompt);
	}

	private async callPerplexity(systemMessage: string, userMessage: string): Promise<ResearchResult> {
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

				console.log(`Found ${data.sources?.length || 0} sources`);

				return data;
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
}