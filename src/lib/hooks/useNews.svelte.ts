// src/lib/hooks/useNews.svelte.ts
import { getNewsContext } from '$lib/context/newsContext.svelte';
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import type { NewsItem } from '$lib/types/news';

export function useNews() {
	// Get contexts
	const newsContext = getNewsContext();
	const fomoContext = getFomoContext();

	// Log debugging information
	console.log('useNews debugging:', {
		newsItems: newsContext.newsItems?.length || 0,
		fomoThreshold: fomoContext.fomoThreshold,
		hasFilter: typeof fomoContext.fomoThreshold === 'number'
	});

	// Get all items from context
	const allItems = newsContext.newsItems || [];

	// Apply filters to items - simple version that should work
	const filteredItems = $derived(() => {
		// Check if we have items to filter
		if (!allItems || allItems.length === 0) {
			console.log('No items to filter');
			return [];
		}

		// Apply a very basic filter on fomo_score
		const filtered = allItems.filter(item => {
			// First check if fomo_score exists
			if (item.fomo_score === null || item.fomo_score === undefined) {
				console.log('Dropping item with no fomo_score:', item.id);
				return false;
			}

			// Compare with threshold
			const passes = item.fomo_score >= fomoContext.fomoThreshold;

			if (!passes) {
				console.log(`Item ${item.id} score ${item.fomo_score} below threshold ${fomoContext.fomoThreshold}`);
			}

			return passes;
		});

		console.log(`Filtered ${allItems.length} items to ${filtered.length} items with threshold ${fomoContext.fomoThreshold}`);

		return filtered;
	});

	// For now, also log scores of all items to confirm data
	console.log('All items fomo_scores:', allItems.map(item => item.fomo_score));

	return {
		// Original data
		allItems: allItems,

		// Filtered data
		items: filteredItems,

		// Pass through other context properties
		isLoading: newsContext.isLoading,
		error: newsContext.error,
		activeItemId: newsContext.activeItemId,

		// Pass through context methods
		setActiveItem: newsContext.setActiveItem,
		setActiveDataSource: newsContext.setActiveDataSource
	};
}