// api-clients/index.ts

import { PerplexityClient } from './perplexity.ts';
import { ResearchRequest, ResearchResult } from '../models/research.ts';

export interface ClientOptions {
	apiKey?: string;
	model?: string;
}

export async function getClient(provider: string = 'perplexity', options: ClientOptions = {}): Promise<any> {
	switch (provider.toLowerCase()) {
		case 'perplexity':
			return new PerplexityClient({
				apiKey: options.apiKey,
				model: options.model
			});

		// Add more providers as they're implemented
		// case 'gemini':
		//   return new GeminiClient(options);

		// case 'openai':
		//   return new OpenAIClient(options);

		default:
			throw new Error(`Unsupported provider: ${provider}`);
	}
}

export async function performResearch(request: ResearchRequest): Promise<ResearchResult> {
	const provider = request.provider || 'perplexity';
	const client = await getClient(provider);

	switch (request.type) {
		case 'url':
			if (!request.url) {
				throw new Error('URL is required for URL-based research');
			}
			return await client.researchUrl(request.url, request.topic); // topic can be used as title here

		case 'topic':
			if (!request.topic) {
				throw new Error('Topic is required for topic-based research');
			}
			return await client.discoverTopicNews(
				request.topic,
				request.timeframe || '24h',
				request.limit || 5
			);

		case 'submission':
			// This would require looking up the submission in the database
			// We'll handle this in the main function
			throw new Error('Submission-based research should be handled in the main function');

		default:
			throw new Error(`Unsupported research type: ${request.type}`);
	}
}