// src/lib/hooks/useNews.svelte.ts
import { getNewsContext } from '$lib/context/newsContext.svelte';
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import type { NewsItem } from '$lib/types/news';



export function useNews() {
	// Get contexts
	const newsContext = getNewsContext();
	const fomoContext = getFomoContext();

	// Apply filters from FOMO context to items
	const filteredItems = $derived(() => {
		const allItems = newsContext.currentItems;

		// If no items, return empty array
		if (!allItems || allItems.length === 0) return [];

		// Apply FOMO threshold filter
		return allItems.filter(item => {
			// Filter by FOMO score
			if (!item.fomo_score || item.fomo_score < fomoContext.fomoThreshold) {
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
				if (!item.tags || !Array.isArray(item.tags)) return false;

				// Check if any selected tag is in the item's tags
				const hasMatchingTag = fomoContext.selectedTags.some(tag =>
					item.tags?.includes(tag)
				);

				if (!hasMatchingTag) return false;
			}

			return true;
		});
	});

	console.log('All items:', newsContext.currentItems.length);
	console.log('Filtered items:', filteredItems.length);
	console.log('FOMO threshold:', fomoContext.fomoThreshold);


	return {
		// Original data
		allItems: newsContext.currentItems,

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

