// src/lib/stores/weekStore.ts
import { writable } from 'svelte/store';
import { db } from '$lib/db';
import { weeks } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export const weekStore = writable({
	weeks: [],
	activeWeek: 0,
	loading: true
});

export async function loadWeeks() {
	try {
		const data = await db.select().from(weeks).orderBy(desc(weeks.weekNumber));
		weekStore.update(state => ({
			...state,
			weeks: data,
			activeWeek: data[0]?.weekNumber || 0,
			loading: false
		}));
	} catch (error) {
		console.error('Failed to load weeks:', error);
	}
}

export function setActiveWeek(weekNumber: number) {
	weekStore.update(state => ({ ...state, activeWeek: weekNumber }));
}