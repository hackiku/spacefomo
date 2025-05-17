// src/lib/components/admin/types.ts

export interface RawNewsItem {
	id: string;
	url: string;
	title?: string;
	publication_date?: string;
	source_name?: string;
	source_type: string;
	source_id?: string;
	discovered_at: string;
	context?: any;
	plaintext?: string;
	status: 'pending' | 'processing' | 'processed' | 'error';
	processed_news_id?: string;
	process_attempts?: number;
	last_attempt_at?: string;
	error?: string;
	source_fomo?: number;
	editor_notes?: string;
}

export interface ApiUsage {
	provider: string;
	status: 'operational' | 'degraded' | 'down';
	latency: number;
	calls: {
		today: number;
		thisWeek: number;
		thisMonth: number;
	};
	costs: {
		today: number;
		thisWeek: number;
		thisMonth: number;
	};
}

export interface ResearchRequest {
	type: 'url' | 'submission' | 'topic';
	submissionId?: string | number;
	url?: string;
	topic?: string;
	timeframe?: string;
	provider?: string;
}