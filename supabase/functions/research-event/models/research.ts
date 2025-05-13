// supabase/functions/research-event/models/research.ts

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
		original_title: string;
		original_url: string;
		found_count: number;
	};
	sources: ResearchSource[];
}

export interface ResearchRequest {
	submissionId?: number | string;
	url?: string;
	title?: string;
	entities?: {
		companies?: { name: string; role?: string }[];
		people?: { name: string; role?: string; company?: string }[];
	};
}