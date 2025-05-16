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

	// Debug log the items we have
	$effect(() => {
		console.log('News items in fomoContext:', {
			totalItems: newsContext.newsItems?.length || 0,
			sampleScores: newsContext.newsItems?.slice(0, 5).map(item => item.fomo_score),
			threshold: fomoThreshold
		});
	});

	// Reactive derived values for filtered items
	const filteredItems = $derived(() => {
		const items = newsContext.newsItems || [];

		// Debug what's happening with the filter
		console.log('Filtering items with threshold:', fomoThreshold);
		console.log('Sample item scores:', items.slice(0, 5).map(item => ({
			id: item.id,
			score: item.fomo_score,
			passes: item.fomo_score >= fomoThreshold
		})));

		// Make sure to convert everything to numbers for the comparison
		const filtered = items.filter(item => {
			// Handle null, undefined, or non-numeric values
			const score = typeof item.fomo_score === 'number'
				? item.fomo_score
				: parseInt(String(item.fomo_score), 10);

			// Only include if it has a valid score and meets threshold
			return !isNaN(score) && score >= fomoThreshold;
		});

		console.log(`Filtered ${items.length} items to ${filtered.length} items with threshold ${fomoThreshold}`);
		return filtered;
	});

	// Current FOMO score average
	const currentScore = $derived(() => {
		try {
			if (filteredItems.length > 0) {
				const totalScore = filteredItems.reduce((sum, item) => {
					const score = typeof item.fomo_score === 'number'
						? item.fomo_score
						: parseInt(String(item.fomo_score), 10);

					return sum + (isNaN(score) ? 0 : score);
				}, 0);
				return Math.round(totalScore / filteredItems.length);
			}
			return 0;
		} catch (e) {
			console.error('Error calculating FOMO score:', e);
			return 0;
		}
	});

	// Article count meeting the threshold
	const articleCount = $derived(() => {
		return filteredItems.length;
	});

	// Date filtered items
	const dateFilteredItems = $derived(() => {
		if (!startDate || !endDate) return filteredItems;

		return filteredItems.filter(item => {
			const pubDate = item.publication_date;
			if (!pubDate) return false;

			// Make sure we're comparing Date objects
			const pubDateObj = pubDate instanceof Date ? pubDate : new Date(pubDate);
			return pubDateObj >= startDate && pubDateObj <= endDate;
		});
	});

	// Tag filtered items
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

	// Debug logging
	$effect(() => {
		console.log('FOMO Context values:', {
			threshold: fomoThreshold,
			filtered: filteredItems.length,
			finalFiltered: finalFilteredItems.length,
			score: currentScore,
			count: articleCount
		});
	});

	const context = {
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

	return context;
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