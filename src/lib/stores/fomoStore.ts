// src/lib/stores/fomoStore.ts
import { writable, derived } from 'svelte/store';

interface FomoState {
	currentScore: number;
	weeklyScores: Array<{
		date: string;
		score: number;
	}>;
	nextUpdate: number; // timestamp
}

function createFomoStore() {
	const { subscribe, set, update } = writable<FomoState>({
		currentScore: 86,
		weeklyScores: [],
		nextUpdate: Date.now() + 604800000 // 1 week from now
	});

	return {
		subscribe,
		setScore: (score: number) => update(state => ({ ...state, currentScore: score })),
		updateNextUpdate: () => update(state => ({
			...state,
			nextUpdate: Date.now() + 604800000
		})),
		addWeeklyScore: (score: number) => update(state => ({
			...state,
			weeklyScores: [...state.weeklyScores, {
				date: new Date().toISOString(),
				score: score
			}]
		}))
	};
}

export const fomoStore = createFomoStore();

// Derived store for gravity well steepness
export const wellSteepness = derived(
	fomoStore,
	$fomo => Math.max(0.2, $fomo.currentScore / 100) // Min steepness of 0.2
);