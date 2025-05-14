// src/routes/admin/api/researchService.ts

import { callEdgeFunction } from './supabaseConfig';
import type { ApiResponse } from './supabaseConfig';

export interface ResearchRequest {
	type: 'url' | 'submission' | 'topic';
	submissionId?: string | number;
	url?: string;
	topic?: string;
	timeframe?: string;
	limit?: number;
	provider?: string;
}

export interface ResearchItem {
	id: string;
	research_type: string;
	submission_id?: number;
	url?: string;
	topic?: string;
	timeframe?: string;
	query: string;
	provider: string;
	results: any;
	status: string;
	created_at: string;
	completed_at?: string;
	error?: string;
}

/**
 * Start a new research process
 */
export async function startResearch(request: ResearchRequest): Promise<ApiResponse<any>> {
	return callEdgeFunction('ingest-research', request);
}

/**
 * Get recent research results
 */
export async function getRecentResearch(limit: number = 10): Promise<ResearchItem[]> {
	try {
		const { data, error } = await window.supabaseClient
			.from('agent_research')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) throw error;
		return data || [];
	} catch (error) {
		console.error('Error fetching recent research:', error);
		return [];
	}
}

/**
 * Write research results to raw_news
 */
export async function writeResearchToRawNews(
	researchId: string,
	sourceType: string = 'agent_research'
): Promise<ApiResponse<any>> {
	return callEdgeFunction('write-raw-news', {
		source_type: sourceType,
		source_id: researchId
	});
}

/**
 * Start URL research and write to raw_news in one step
 */
export async function researchAndWriteUrl(url: string, provider: string = 'perplexity'): Promise<ApiResponse<any>> {
	try {
		// Step 1: Start research
		const researchResult = await startResearch({
			type: 'url',
			url,
			provider
		});

		if (!researchResult.success || !researchResult.data?.researchId) {
			return { success: false, error: researchResult.error || 'Failed to start research' };
		}

		// Step 2: Write to raw_news
		const writeResult = await writeResearchToRawNews(researchResult.data.researchId);

		return writeResult;
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error during research process'
		};
	}
}