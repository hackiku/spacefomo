// src/lib/features/fomo/stores/fomoStore.ts
import { writable, derived } from 'svelte/store';

export type Week = {
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
};

const mockWeeks: Week[] = [
	{
		weekNumber: 5,
		score: 85,
		startDate: new Date(2024, 1, 17),
		endDate: new Date(2024, 1, 23),
		summary: "SpaceX's Starship orbital test exceeds expectations. Private sector space competition intensifies as Rocket Lab announces new heavy-lift vehicle development.",
		stats: {
			launchActivity: 92,
			industryBuzz: 88,
			techImpact: 85
		}
	},
	{
		weekNumber: 4,
		score: 72,
		startDate: new Date(2024, 1, 10),
		endDate: new Date(2024, 1, 16),
		summary: "NASA confirms critical Artemis milestone ahead of schedule. Blue Origin's New Glenn preparations signal major launch capabilities expansion.",
		stats: {
			launchActivity: 75,
			industryBuzz: 70,
			techImpact: 71
		}
	},
	{
		weekNumber: 3,
		score: 68,
		startDate: new Date(2024, 1, 3),
		endDate: new Date(2024, 1, 9),
		summary: "ESA and JAXA announce joint Mars sample return mission. Virgin Galactic achieves new altitude record with next-gen spacecraft.",
		stats: {
			launchActivity: 65,
			industryBuzz: 72,
			techImpact: 67
		}
	},
	{
		weekNumber: 2,
		score: 78,
		startDate: new Date(2024, 0, 27),
		endDate: new Date(2024, 0, 2),
		summary: "Breakthrough in space solar power transmission demos practical energy beaming. China's space station expansion enters new phase.",
		stats: {
			launchActivity: 80,
			industryBuzz: 75,
			techImpact: 79
		}
	},
	{
		weekNumber: 1,
		score: 65,
		startDate: new Date(2024, 0, 20),
		endDate: new Date(2024, 0, 26),
		summary: "First commercial lunar lander touches down successfully. Space tourism bookings surge as new providers enter market.",
		stats: {
			launchActivity: 68,
			industryBuzz: 62,
			techImpact: 65
		}
	}
];

const createFomoStore = () => {
	const { subscribe, set, update } = writable({
		weeks: mockWeeks,
		activeWeek: 5
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
		refreshWeeks: async () => {
			// This will be replaced with actual database queries when implementing Drizzle
			set({ weeks: mockWeeks, activeWeek: 5 });
		}
	};
};

export const fomoStore = createFomoStore();