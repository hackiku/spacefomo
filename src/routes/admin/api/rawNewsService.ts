// src/routes/admin/api/rawNewsService.ts

import { getSupabaseClient } from './supabaseClient';
import { callEdgeFunction } from './supabaseConfig';
import type { ApiResponse } from './supabaseConfig';
import { browser } from '$app/environment';

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

/**
 * Fetch raw news items from Supabase
 */
export async function fetchRawNews(
	options: {
		limit?: number;
		status?: string;
		source_type?: string;
		order?: 'asc' | 'desc';
	} = {}
): Promise<RawNewsItem[]> {
	if (!browser) return [];

	try {
		const client = getSupabaseClient();
		if (!client) {
			console.error('Supabase client not available');
			return [];
		}

		console.log('Fetching raw news with options:', options);

		// First, let's check if the table exists by getting just one row
		const testQuery = await client
			.from('raw_news')
			.select('id')
			.limit(1);

		if (testQuery.error) {
			console.error('Test query failed:', testQuery.error);

			// Let's try getting all tables to see what's available
			const { data: tables } = await client.rpc('get_all_tables');
			console.log('Available tables:', tables);

			return [];
		}

		// Now proceed with the actual query
		let query = client
			.from('raw_news')
			.select('*');

		// Apply filters
		if (options.status) {
			query = query.eq('status', options.status);
		}

		if (options.source_type) {
			query = query.eq('source_type', options.source_type);
		}

		// Apply ordering
		query = query.order('discovered_at', { ascending: options.order === 'asc' });

		// Apply limit
		if (options.limit) {
			query = query.limit(options.limit);
		}

		const { data, error } = await query;

		if (error) {
			console.error('Error in Supabase query:', error);
			throw error;
		}

		console.log(`Fetched ${data?.length || 0} raw news items`);

		// If we got data, log the first item to inspect its structure
		if (data && data.length > 0) {
			console.log('Sample raw news item:', data[0]);
		}

		return data || [];
	} catch (error) {
		console.error('Error fetching raw news:', error);

		// If it's a Supabase error, it might have a code and details
		if (error && typeof error === 'object' && 'code' in error) {
			console.error('Supabase error code:', error.code);
			console.error('Supabase error details:', error.details);
		}

		return [];
	}
}

/**
 * Process a raw news item into processed_news
 */
export async function processRawNews(
	rawNewsId: string,
	provider: string = 'perplexity'
): Promise<ApiResponse<any>> {
	return callEdgeFunction('write-news', {
		raw_news_id: rawNewsId,
		provider
	});
}

/**
 * Process multiple raw news items in batch
 */
export async function processBatchRawNews(
	rawNewsIds: string[],
	provider: string = 'perplexity'
): Promise<ApiResponse<any>> {
	return callEdgeFunction('write-news', {
		ids: rawNewsIds,
		provider
	});
}

/**
 * Get single raw news item details
 */
export async function getRawNewsItem(id: string): Promise<RawNewsItem | null> {
	if (!browser) return null;

	try {
		const client = getSupabaseClient();
		if (!client) return null;

		const { data, error } = await client
			.from('raw_news')
			.select('*')
			.eq('id', id)
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error(`Error fetching raw news item ${id}:`, error);
		return null;
	}
}

/**
 * Update raw news item status
 */
export async function updateRawNewsStatus(
	id: string,
	status: 'pending' | 'processing' | 'processed' | 'error',
	additionalData: Partial<RawNewsItem> = {}
): Promise<boolean> {
	if (!browser) return false;

	try {
		const client = getSupabaseClient();
		if (!client) return false;

		const { error } = await client
			.from('raw_news')
			.update({
				status,
				last_attempt_at: new Date().toISOString(),
				...additionalData
			})
			.eq('id', id);

		if (error) throw error;
		return true;
	} catch (error) {
		console.error(`Error updating raw news status ${id}:`, error);
		return false;
	}
}

/**
 * List all raw news as mock data for testing
 */
export function getMockRawNews(): RawNewsItem[] {
	return [
		{
			id: "0cf7c618-9c7e-47df-aeaa-7f6b36a6c46e",
			url: "xxxxhttps://orbitaltoday.com/2025/05/10/interlune-just-unveiled-a-lunar-excavator-to-kickstart-helium-3-mining/",
			title: "Interlune Just Unveiled a Lunar Excavator to Kickstart Helium-3 Mining",
			publication_date: "2025-05-10",
			source_name: "Orbital Today",
			source_type: "agent_research",
			discovered_at: "2025-05-13T18:39:17.890Z",
			status: "pending"
		},
		{
			id: "24a1ef6e-c074-4bba-89ed-2450749c2be5",
			url: "xxxxxxxhttps://www.techeblog.com/bridgestone-new-lunar-rover-tire-prototypes-jaxa/",
			title: "Bridgestone's Two New Lunar Rover Tire Prototypes Use Thin Metal Spokes",
			publication_date: "2025-04-07",
			source_name: "Techeblog",
			source_type: "agent_research",
			discovered_at: "2025-05-13T20:00:28.984Z",
			status: "pending"
		},
		{
			id: "3945df80-a69c-4bbf-83ae-91084b4a9dd0",
			url: "xxxxxxhttps://interestingengineering.com/space/halospace-aurora-balloon-tourism",
			title: null,
			publication_date: null,
			source_name: "interestingengineering.com",
			source_type: "submission",
			discovered_at: "2025-05-13T17:29:47.708Z",
			status: "pending"
		},
		{
			id: "4069537e-05ff-48b7-8c85-e82a0c4b71e5",
			url: "xxxxxhttps://orbitaltoday.com/2025/05/13/space-law-is-stuck-in-the-60s-we-can-mine-the-moon-but-we-cant-protect-it/",
			title: "Space Law Is Stuck in the '60s: We Can Mine the Moon, But We Can't Protect It",
			publication_date: "2025-05-13",
			source_name: "Orbital Today",
			source_type: "agent_research",
			discovered_at: "2025-05-13T18:39:17.883Z",
			status: "pending"
		}
	];
}