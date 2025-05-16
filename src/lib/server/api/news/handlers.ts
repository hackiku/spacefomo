// src/lib/server/api/news/handlers.ts
import * as queries from './queries';
import type { NewsFilters } from '$lib/types/news';

/**
 * Handles the news feed request with filtering and pagination
 */
export async function getNewsFeed(url: URL) {
	// Extract query parameters
	const filters: NewsFilters = {
		minScore: parseInt(url.searchParams.get('minScore') || '0'),
		tags: url.searchParams.get('tags')?.split(',').filter(Boolean) || [],
		dateStart: url.searchParams.get('dateStart') || undefined,
		dateEnd: url.searchParams.get('dateEnd') || undefined
	};

	// Pagination parameters
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const limit = parseInt(url.searchParams.get('limit') || '100');

	try {
		// Get filtered news from database
		const { items, count } = await queries.getNewsWithFilters({
			...filters,
			offset,
			limit
		});

		return {
			items,
			totalCount: count,
			offset,
			limit,
			pageCount: Math.ceil(count / limit)
		};
	} catch (error) {
		console.error('Error in getNewsFeed:', error);
		throw error;
	}
}

/**
 * Handles requests for a specific news item by ID
 */
export async function getNewsItem(id: number) {
	if (isNaN(id)) {
		throw new Error('Invalid news ID format');
	}

	try {
		const item = await queries.getNewsById(id);

		if (!item) {
			throw new Error(`News item with ID ${id} not found`);
		}

		return item;
	} catch (error) {
		console.error(`Error in getNewsItem(${id}):`, error);
		throw error;
	}
}