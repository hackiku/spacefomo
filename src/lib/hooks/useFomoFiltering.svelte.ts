// src/lib/hooks/useFomoFiltering.ts
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import { getNewsContext } from '$lib/context/newsContext.svelte';

/**
 * A hook that connects the FOMO filtering system to the news grid.
 * Used for coordinating filtering across components.
 */
export function useFomoFiltering() {
	// Get both contexts
	const fomoContext = getFomoContext();
	const newsContext = getNewsContext();

	// Access key values
	const {
		fomoThreshold,
		startDate,
		endDate,
		filteredNews,
		currentFomoScore,
		setFomoThreshold,
		setDateRange
	} = fomoContext;

	// News source toggle functionality
	let activeSource = $state<'news' | 'processed_news'>('news');

	function setNewsSource(source: 'news' | 'processed_news', data: any[] = []) {
		activeSource = source;
		fomoContext.setDataSource(source, data);
	}

	// State to indicate if FOMO filtering is active in the grid
	let applyFomoFiltersToGrid = $state(false);

	// For news grid integration
	function toggleFomoFiltering() {
		applyFomoFiltersToGrid = !applyFomoFiltersToGrid;
	}

	// Get filtered items for the News Grid
	const filteredItems = $derived(() => {
		// If FOMO filtering is disabled, return all news
		if (!applyFomoFiltersToGrid) {
			return newsContext.items;
		}

		// Otherwise, return the FOMO-filtered news
		return filteredNews;
	});

	return {
		// State
		fomoThreshold,
		startDate,
		endDate,
		currentFomoScore,
		activeSource,
		applyFomoFiltersToGrid,
		filteredItems,

		// Methods
		setFomoThreshold,
		setDateRange,
		setNewsSource,
		toggleFomoFiltering
	};
}