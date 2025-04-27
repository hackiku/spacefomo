// src/supabase/functions/process-news/index.ts

// Define the interface for extraction providers
export interface ExtractionResult {
	title: string;
	source?: string;
	publication_date?: string;
	read_time?: number;
	entities?: any;
	context?: any;
	viral_title?: string;
	summary?: string;
	tags?: string[];
	impact_score?: number;
	slug?: string;
	[key: string]: any; // Allow for additional fields
}

export interface ExtractionProvider {
	name: string;
	extract(url: string, options?: any): Promise<ExtractionResult>;
}

// Provider factory
export class ProviderFactory {
	private static providers: Map<string, ExtractionProvider> = new Map();
	private static defaultProvider: string = 'openai';

	static register(provider: ExtractionProvider): void {
		this.providers.set(provider.name, provider);
	}

	static getProvider(name?: string): ExtractionProvider {
		const providerName = name || this.defaultProvider;
		const provider = this.providers.get(providerName);

		if (!provider) {
			throw new Error(`Extraction provider '${providerName}' not found`);
		}

		return provider;
	}

	static setDefaultProvider(name: string): void {
		if (!this.providers.has(name)) {
			throw new Error(`Cannot set default: provider '${name}' not registered`);
		}
		this.defaultProvider = name;
	}

	static listProviders(): string[] {
		return Array.from(this.providers.keys());
	}
}