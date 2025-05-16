// src/lib/services/api/newsApiService.ts
import { supabase } from '$lib/server/supabase/client';
import type { NewsApiParams, NewsApiResponse } from '$lib/types/api';

export async function getNewsItems(params: NewsApiParams): Promise<NewsApiResponse> {
	const {
		limit = 20,
		offset = 0,
		tags = [],
		weekId = null,
		minScore = 0,
		sortBy = 'fomo_score',
		sortDir = 'desc'
	} = params;

	let query = supabase
		.from('news')
		.select('*', { count: 'exact' });

	// Apply filters
	if (weekId) {
		query = query.eq('week_id', weekId);
	}

	if (minScore > 0) {
		query = query.gte('fomo_score', minScore);
	}

	if (tags.length > 0) {
		// Supabase array contains operator
		query = query.contains('tags', tags);
	}

	// Apply sorting and pagination
	query = query
		.order(sortBy, { ascending: sortDir === 'asc' })
		.range(offset, offset + limit - 1);

	const { data, error, count } = await query;

	if (error) {
		throw new Error(`API error: ${error.message}`);
	}

	return {
		items: data || [],
		total: count || 0,
		limit,
		offset,
		hasMore: (count || 0) > offset + limit
	};
}

export async function getNewsItemById(id: number) {
	const { data, error } = await supabase
		.from('news')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		throw new Error(`API error: ${error.message}`);
	}

	if (!data) {
		throw new Error(`News item with ID ${id} not found`);
	}

	return data;
}