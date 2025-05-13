// supabase/functions/ingest-research/models/research.ts

export interface ResearchSource {
	title: string;
	url: string;
	source: string;
	summary?: string;
	date?: string;
}

export interface ResearchResult {
	meta: {
		query: string;
		original_title?: string;
		original_url?: string;
		found_count: number;
		research_type: 'url_related' | 'topic_discovery' | 'event_tracking';
	};
	sources: ResearchSource[];
}

export interface ResearchRequest {
	type: 'url' | 'submission' | 'topic';
	submissionId?: string | number;
	url?: string;
	topic?: string;
	timeframe?: string; // e.g. "24h", "7d", "30d"
	limit?: number; // Number of results to return
	provider?: string; // "perplexity", "gemini", "openai"
}

export interface StoredResearch {
	id: string;
	request: ResearchRequest;
	result: ResearchResult;
	created_at: string;
	source_id?: string; // ID of submission or other source if applicable
	status: 'complete' | 'error' | 'processing';
	error?: string;
}

