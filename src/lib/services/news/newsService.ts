// src/lib/services/news/newsService.ts
import { supabase } from '../supabase/client';
import type { NewsItem } from '$lib/types/news';

interface NewsFilters {
	limit?: number;
	offset?: number;
	tags?: string[];
	weekId?: number | null;
	minScore?: number;
}

export async function fetchNews(filters: NewsFilters = {}) {
	const {
		limit = 50,
		offset = 0,
		tags = [],
		weekId = null,
		minScore = 0
	} = filters;

	let query = supabase
		.from('news')
		.select('*')
		.order('fomo_score', { ascending: false })
		.limit(limit);

	if (weekId !== null) {
		query = query.eq('week_id', weekId);
	}

	if (minScore > 0) {
		query = query.gte('fomo_score', minScore);
	}

	if (tags.length > 0) {
		// For arrays in Postgres
		query = query.contains('tags', tags);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(`Error fetching news: ${error.message}`);
	}

	return {
		items: data || []
	};
}

export async function fetchNewsById(id: number) {
	const { data, error } = await supabase
		.from('news')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		throw new Error(`Error fetching news item: ${error.message}`);
	}

	if (!data) {
		throw new Error(`News item with ID ${id} not found`);
	}

	return data;
}