// src/lib/stores/fomoStore.ts
import { writable, derived } from 'svelte/store';
import type { FomoState, WeekData } from '$lib/types';

function generateWeeks(): WeekData[] {
	return Array.from({ length: 4 }, (_, i) => {
		const today = new Date();
		const monday = new Date(today);
		monday.setDate(monday.getDate() - monday.getDay() + 1 - (i * 7));

		const nextMonday = new Date(monday);
		nextMonday.setDate(monday.getDate() + 7);

		return {
			id: i,
			startDate: monday,
			endDate: nextMonday,
			score: 85 - (i * 5), // Demo scores decreasing by 5 each week back
			stats: {
				launchActivity: 85 - (i * Math.random() * 10),
				industryBuzz: 85 - (i * Math.random() * 10),
				techImpact: 85 - (i * Math.random() * 10)
			}
		};
	}).reverse();
}

function createFomoStore() {
	const weeks = generateWeeks();
	const { subscribe, set, update } = writable<FomoState>({
		currentScore: weeks[weeks.length - 1].score,
		currentWeekIndex: weeks.length - 1,
		weeks,
		nextUpdate: Date.now() + 604800000 // 1 week from now
	});

	return {
		subscribe,
		setCurrentWeek: (index: number) => update(state => ({
			...state,
			currentWeekIndex: index,
			currentScore: state.weeks[index].score
		})),
		updateNextUpdate: () => update(state => ({
			...state,
			nextUpdate: Date.now() + 604800000
		})),
		addWeek: () => update(state => {
			const newWeek = {
				id: state.weeks.length,
				startDate: state.weeks[state.weeks.length - 1].endDate,
				endDate: new Date(state.weeks[state.weeks.length - 1].endDate.getTime() + 7 * 24 * 60 * 60 * 1000),
				score: Math.round(80 + Math.random() * 20),
				stats: {
					launchActivity: Math.round(80 + Math.random() * 20),
					industryBuzz: Math.round(80 + Math.random() * 20),
					techImpact: Math.round(80 + Math.random() * 20)
				}
			};
			return {
				...state,
				weeks: [...state.weeks.slice(1), newWeek],
				currentWeekIndex: state.weeks.length - 1,
				currentScore: newWeek.score
			};
		})
	};
}

export const fomoStore = createFomoStore();

// Derived stores for gravity well effects
export const wellSteepness = derived(
	fomoStore,
	$fomo => Math.max(0.2, $fomo.currentScore / 100)
);

export const wellDepth = derived(
	fomoStore,
	$fomo => Math.max(20, ($fomo.currentScore / 100) * 50)
);

export const wellSize = derived(
	fomoStore,
	$fomo => Math.max(0.4, $fomo.currentScore / 100)
);