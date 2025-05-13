// supabase/functions/write-news/providers/index.ts

import { PerplexityProvider } from './perplexity.ts';
import { AnthropicProvider } from './anthropic.ts';
import { OpenAIProvider } from './openai.ts';

export interface ProcessOptions {
	title?: string;
	source?: string;
	publicationDate?: string | Date;
	context?: any;
}

export interface ExtractedData {
	title: string;
	source?: string;
	read_time?: number;
	fomo_score?: number;
	tags?: string[];
	entities?: any;
	context?: any;
	impact_score?: number;
	publication_date?: string;
	viral_title?: string;
	slug?: string;
	summary?: string;
	plaintext?: string;
}

export interface NewsProvider {
	processUrl(url: string, options?: ProcessOptions): Promise<ExtractedData>;
}

interface ProviderOptions {
	apiKey?: string;
	model?: string;
}

/**
 * Factory function to get the appropriate provider
 */
export async function getProvider(provider: string = 'perplexity', options: ProviderOptions = {}): Promise<NewsProvider> {
	switch (provider.toLowerCase()) {
		case 'perplexity':
			return new PerplexityProvider({
				apiKey: options.apiKey,
				model: options.model
			});

		case 'anthropic':
		case 'claude':
			return new AnthropicProvider({
				apiKey: options.apiKey,
				model: options.model
			});

		case 'openai':
		case 'gpt':
			return new OpenAIProvider({
				apiKey: options.apiKey,
				model: options.model
			});

		default:
			throw new Error(`Unsupported provider: ${provider}`);
	}
}