// src/lib/server/api/news/queries.ts
import { supabase } from '$lib/server/db/client';
import type { NewsFilters } from '$lib/types/news';

export async function getNewsWithFilters(filters: NewsFilters) {
	// Build query with selection and count
	let query = supabase.from('news').select('*', { count: 'exact' });

	// Apply score filter
	if (filters.minScore) {
		query = query.gte('fomo_score', filters.minScore);
	}

	// Apply date filters if present
	if (filters.dateStart && filters.dateEnd) {
		query = query
			.gte('publication_date', filters.dateStart)
			.lte('publication_date', filters.dateEnd);
	}

	// Apply tag filtering
	if (filters.tags && filters.tags.length > 0) {
		query = query.contains('tags', filters.tags);
	}

	// Apply sorting
	const sortField = filters.sortBy || 'publication_date';
	const sortDirection = filters.sortDir || 'desc';
	query = query.order(sortField, { ascending: sortDirection === 'asc' });

	// Apply pagination
	if (filters.offset !== undefined && filters.limit !== undefined) {
		query = query.range(
			filters.offset,
			filters.offset + filters.limit - 1
		);
	}

	// Execute query
	const { data, error, count } = await query;

	if (error) throw new Error(`Database error: ${error.message}`);

	return {
		items: data || [],
		count: count || 0
	};
}

export async function getNewsById(id: number) {
	const { data, error } = await supabase
		.from('news')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			throw new Error(`News item with ID ${id} not found`);
		}
		throw new Error(`Database error: ${error.message}`);
	}

	return data;
}