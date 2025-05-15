// src/lib/hooks/useNews.svelte.ts
import { getNewsContext } from '$lib/context/newsContext.svelte';
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import type { NewsItem } from '$lib/types/news';

// Create a global filtered items array to avoid reactivity issues
let _filteredItems: NewsItem[] = [];

export function useNews() {
	// Get contexts
	const newsContext = getNewsContext();
	const fomoContext = getFomoContext();

	// Get all items from context
	const allItems = newsContext.newsItems || [];

	// Use a function to filter items, not a derived statement which can cause issues
	function filterItems() {
		const threshold = fomoContext.fomoThreshold;
		console.log(`Filtering with threshold: ${threshold}`);

		// Filter based on FOMO score
		_filteredItems = allItems.filter(item => {
			const score = item.fomo_score;
			// Include only if score exists and meets threshold
			return (score !== null && score !== undefined && score >= threshold);
		});

		console.log(`Filtered ${allItems.length} items to ${_filteredItems.length} items`);
		return _filteredItems;
	}

	// Always filter when the hook is called
	const items = filterItems();

	// Debug logging
	console.log('All items fomo_scores:', allItems.map(item => item.fomo_score));
	console.log('useNews debugging:', {
		newsItems: allItems.length,
		fomoThreshold: fomoContext.fomoThreshold,
		hasFilter: typeof fomoContext.fomoThreshold === 'number',
		filteredCount: items.length
	});

	return {
		// Original data
		allItems,

		// Filtered data
		items,

		// Pass through other context properties
		isLoading: newsContext.isLoading,
		error: newsContext.error,
		activeItemId: newsContext.activeItemId,

		// Pass through context methods
		setActiveItem: newsContext.setActiveItem,
		setActiveDataSource: newsContext.setActiveDataSource,
		getActiveItem: newsContext.getActiveItem
	};
}