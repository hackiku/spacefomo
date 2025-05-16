// src/lib/context/fomoContext.svelte.ts
import { getContext, setContext } from 'svelte';
import { getNewsContext } from './newsContext.svelte';
import type { NewsItem } from '$lib/types/news';

export function createFomoContext() {
	// Filter criteria state
	let fomoThreshold = $state(80);
	let startDate = $state<Date | null>(null);
	let endDate = $state<Date | null>(null);
	let selectedTags = $state<string[]>([]);

	// Visualization state
	let visualizationType = $state<'bar' | 'line' | 'heatmap'>('bar');
	let isExpanded = $state(false);

	// Access news context for filtering
	const newsContext = getNewsContext();

	// Get the items to filter
	const itemsToFilter = $derived(() => newsContext.newsItems || []);

	// First-level filter: FOMO score
	const scoreFilteredItems = $derived(() => {
		return itemsToFilter.filter(item => {
			// Handle null, undefined, or non-numeric values
			const score = typeof item.fomo_score === 'number'
				? item.fomo_score
				: parseInt(String(item.fomo_score), 10);

			// Only include if it has a valid score and meets threshold
			return !isNaN(score) && score >= fomoThreshold;
		});
	});

	// Second-level filter: Date range
	const dateFilteredItems = $derived(() => {
		if (!startDate || !endDate) return scoreFilteredItems;

		return scoreFilteredItems.filter(item => {
			const pubDate = item.publication_date;
			if (!pubDate) return false;

			// Make sure we're comparing Date objects
			const pubDateObj = pubDate instanceof Date ? pubDate : new Date(pubDate);
			return pubDateObj >= startDate && pubDateObj <= endDate;
		});
	});

	// Third-level filter: Tags
	const finalFilteredItems = $derived(() => {
		if (selectedTags.length === 0) return dateFilteredItems;

		return dateFilteredItems.filter(item => {
			// Handle different possible formats of tags
			const itemTags = item.tags
				? (Array.isArray(item.tags) ? item.tags : JSON.parse(String(item.tags)))
				: [];

			return selectedTags.some(tag => itemTags.includes(tag));
		});
	});

	// Calculate the average FOMO score
	const scoreSum = $derived(() => {
		return finalFilteredItems.reduce((sum, item) => {
			const score = typeof item.fomo_score === 'number'
				? item.fomo_score
				: parseInt(String(item.fomo_score), 10);

			return sum + (isNaN(score) ? 0 : score);
		}, 0);
	});

	// Calculate the average score
	const currentScore = $derived(() => {
		return finalFilteredItems.length > 0
			? Math.round(scoreSum / finalFilteredItems.length)
			: 0;
	});

	// Count of articles
	const articleCount = $derived(() => finalFilteredItems.length);

	// Methods
	function setFomoThreshold(value: number) {
		console.log("Context: Setting FOMO threshold to:", value);
		if (value !== fomoThreshold) {
			fomoThreshold = value;
		}
	}

	function setDateRange(start: Date | null, end: Date | null) {
		startDate = start;
		endDate = end;
	}

	function setSelectedTags(tags: string[]) {
		selectedTags = tags;
	}

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	function setVisualizationType(type: 'bar' | 'line' | 'heatmap') {
		visualizationType = type;
	}

	// Additional methods that might be needed from news context
	function setActiveItem(id: number | null) {
		newsContext.setActiveItem(id);
	}

	return {
		// Filter criteria
		fomoThreshold,
		startDate,
		endDate,
		selectedTags,

		// Visualization state
		visualizationType,
		isExpanded,

		// Derived values
		filteredItems: finalFilteredItems,
		currentScore,
		articleCount,

		// Methods
		setFomoThreshold,
		setDateRange,
		setSelectedTags,
		toggleExpanded,
		setVisualizationType,
		setActiveItem,

		// Pass through from news context
		isLoading: newsContext.isLoading,
		error: newsContext.error
	};
}

// Helper to get the fomo context
export function getFomoContext() {
	const context = getContext<ReturnType<typeof createFomoContext>>('fomo');
	if (!context) {
		throw new Error('getFomoContext must be used within a component with FomoContext');
	}
	return context;
}

// Helper to set up the fomo context
export function setupFomoContext() {
	const context = createFomoContext();
	setContext('fomo', context);
	return context;
}