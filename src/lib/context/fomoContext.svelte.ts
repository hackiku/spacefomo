// src/lib/context/fomoContext.ts
import { getContext } from 'svelte';

export type FomoWeek = {
	id: number;
	weekNumber: number;
	score: number;
	startDate: Date;
	endDate: Date;
	summary: string;
	stats: {
		launchActivity: number;
		industryBuzz: number;
		techImpact: number;
	};
	createdAt: Date;
};

export function createFomoContext(initialData: FomoWeek[] = []) {
	// Core state
	let weeks = $state<FomoWeek[]>([]);
	let activeWeekNumber = $state<number | null>(null);

	// Derived values
	const currentWeek = $derived(
		weeks.find(week => week.weekNumber === activeWeekNumber)
	);

	// Methods
	function setActiveWeek(weekNumber: number) {
		activeWeekNumber = weekNumber;
	}

	function initializeWeeks(newWeeks: FomoWeek[]) {
		const sortedWeeks = [...newWeeks].sort((a, b) => b.weekNumber - a.weekNumber);

		weeks = sortedWeeks.map(week => ({
			...week,
			startDate: week.startDate instanceof Date ? week.startDate : new Date(week.startDate),
			endDate: week.endDate instanceof Date ? week.endDate : new Date(week.endDate),
			createdAt: week.createdAt instanceof Date ? week.createdAt : new Date(week.createdAt)
		}));

		// Set active week to the most recent one
		activeWeekNumber = sortedWeeks[0]?.weekNumber ?? null;
	}

	// Initialize with data if provided
	if (initialData.length > 0) {
		initializeWeeks(initialData);
	}

	return {
		// State
		weeks,
		activeWeekNumber,
		currentWeek,

		// Methods
		setActiveWeek,
		initializeWeeks
	};
}

// Helper to get the fomo context
export function getFomoContext() {
	return getContext<ReturnType<typeof createFomoContext>>('fomo');
}

// Helper to create a hook for fomo data
export function useFomo() {
	const context = getFomoContext();

	if (!context) {
		throw new Error('useFomo must be used within a component with FomoContext');
	}

	return context;
}