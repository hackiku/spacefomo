// src/lib/stores/fomoStore.ts

import { writable, derived } from 'svelte/store';

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

const createFomoStore = () => {
	const { subscribe, set, update } = writable<{
		weeks: FomoWeek[];
		activeWeek: number | null;
	}>({
		weeks: [],
		activeWeek: null
	});

	const currentWeek = derived(
		{ subscribe },
		($state) => $state.weeks.find(w => w.weekNumber === $state.activeWeek)
	);

	return {
		subscribe,
		currentWeek,
		setActiveWeek: (weekNumber: number) => update(state => ({
			...state,
			activeWeek: weekNumber
		})),
		initializeWeeks: (weeks: FomoWeek[]) => {
			const sortedWeeks = [...weeks].sort((a, b) => b.weekNumber - a.weekNumber);
			set({
				weeks: sortedWeeks,
				activeWeek: sortedWeeks[0]?.weekNumber ?? null
			});
		}
	};
};

export const fomoStore = createFomoStore();