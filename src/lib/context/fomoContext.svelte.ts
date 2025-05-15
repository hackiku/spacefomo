// src/lib/context/fomoContext.svelte.ts
import { getContext } from 'svelte';

export function createFomoContext() {
	// Filter criteria state
	let fomoThreshold = $state(50);  // Default FOMO threshold
	let startDate = $state<Date | null>(null);
	let endDate = $state<Date | null>(null);
	let selectedTags = $state<string[]>([]);

	// Visualization state
	let visualizationType = $state<'bar' | 'line' | 'heatmap'>('bar');
	let isExpanded = $state(false);

	// Methods
	function setFomoThreshold(value: number) {
		fomoThreshold = value;
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
	return getContext<ReturnType<typeof createFomoContext>>('fomo');
}