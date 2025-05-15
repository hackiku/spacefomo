// src/lib/hooks/useNews.svelte.ts
import { getNewsContext } from '$lib/context/newsContext.svelte';
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import type { NewsItem } from '$lib/types/news';

export function useNews() {
	// Get contexts
	const newsContext = getNewsContext();
	const fomoContext = getFomoContext();

	// All items from context
	const allItems = newsContext.newsItems;

	// Apply filters from FOMO context to items
	const filteredItems = $derived(() => {
		// Log key filter components
		console.log('Filtering with threshold:', fomoContext.fomoThreshold);
		console.log('Date range:', fomoContext.startDate, fomoContext.endDate);
		console.log('Tags:', fomoContext.selectedTags);

		// If no items, return empty array
		if (!allItems || allItems.length === 0) return [];

		// Apply FOMO threshold filter - temporarily relax this to see if it's the issue
		return allItems.filter(item => {
			// Accept items with no FOMO score in testing
			if (item.fomo_score === null || item.fomo_score === undefined) {
				return true;
			}

			// For testing purposes, let's be more lenient with the threshold
			// After testing, you can restore the proper threshold check
			if (fomoContext.fomoThreshold > 0 && item.fomo_score < fomoContext.fomoThreshold) {
				return false;
			}

			// Filter by date range if active
			if (fomoContext.startDate && fomoContext.endDate && item.publication_date) {
				const pubDate = new Date(item.publication_date);
				if (pubDate < fomoContext.startDate || pubDate > fomoContext.endDate) {
					return false;
				}
			}

			// Filter by tags if set
			if (fomoContext.selectedTags && fomoContext.selectedTags.length > 0) {
				// Skip tag filtering if item has no tags
				if (!item.tags || !Array.isArray(item.tags)) return true;

				// Check if any selected tag is in the item's tags
				const hasMatchingTag = fomoContext.selectedTags.some(tag =>
					item.tags?.includes(tag)
				);

				if (!hasMatchingTag) return false;
			}

			return true;
		});
	});

	console.log('Filtered items count:', filteredItems.length);

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