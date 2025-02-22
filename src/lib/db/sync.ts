// src/lib/db/sync.ts
import { supabase } from '$lib/supabaseClient';
import { writable, type Writable } from 'svelte/store';

export interface Week {
	id: number;
	week_number: number;
	score: number;
	created_at: string;
	start_date: string;
	end_date: string;
	summary: string;
	stats: {
		launchActivity: number;
		industryBuzz: number;
		techImpact: number;
	};
}

interface WeeksStore {
	weeks: Week[];
	activeWeek: number;
	loading: boolean;
	error: string | null;
}

function createWeeksStore() {
	const { subscribe, set, update }: Writable<WeeksStore> = writable({
		weeks: [],
		activeWeek: 0,
		loading: true,
		error: null
	});

	return {
		subscribe,

		// Initialize store and subscribe to realtime changes
		init: async () => {
			try {
				// Initial fetch
				const { data, error } = await supabase
					.from('weeks')
					.select('*')
					.order('week_number', { ascending: false });

				if (error) throw error;

				update(state => ({
					...state,
					weeks: data,
					activeWeek: data[0]?.week_number || 0,
					loading: false
				}));

				// Subscribe to realtime changes
				const subscription = supabase
					.channel('weeks_changes')
					.on('postgres_changes',
						{
							event: '*',
							schema: 'public',
							table: 'weeks'
						},
						async (payload) => {
							const { data, error } = await supabase
								.from('weeks')
								.select('*')
								.order('week_number', { ascending: false });

							if (!error && data) {
								update(state => ({
									...state,
									weeks: data,
									activeWeek: state.activeWeek || data[0]?.week_number
								}));
							}
						}
					)
					.subscribe();

				return () => {
					subscription.unsubscribe();
				};
			} catch (err) {
				update(state => ({
					...state,
					error: err instanceof Error ? err.message : 'An error occurred',
					loading: false
				}));
			}
		},

		setActiveWeek: (weekNumber: number) => {
			update(state => ({ ...state, activeWeek: weekNumber }));
		},

		// Add new week
		addWeek: async (week: Omit<Week, 'id' | 'created_at'>) => {
			const { data, error } = await supabase
				.from('weeks')
				.insert([week])
				.select()
				.single();

			if (error) {
				update(state => ({ ...state, error: error.message }));
				return null;
			}

			return data;
		}
	};
}

export const weeksStore = createWeeksStore();