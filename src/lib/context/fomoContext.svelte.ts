// src/lib/context/fomoContext.svelte.ts
import { getContext } from 'svelte';

export function createFomoContext() {
	// Filter criteria state - make sure to use exactly 50 as the default
	let fomoThreshold = $state(80);
	let startDate = $state<Date | null>(null);
	let endDate = $state<Date | null>(null);
	let selectedTags = $state<string[]>([]);

	// Visualization state
	let visualizationType = $state<'bar' | 'line' | 'heatmap'>('bar');
	let isExpanded = $state(false);

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

	return {
		// Filter criteria
		fomoThreshold,
		startDate,
		endDate,
		selectedTags,

		// Visualization state
		visualizationType,
		isExpanded,

		// Methods
		setFomoThreshold,
		setDateRange,
		setSelectedTags,
		toggleExpanded,
		setVisualizationType
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