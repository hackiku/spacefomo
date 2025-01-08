// $lib/stores/styleStore.ts
import { writable } from 'svelte/store';
import type { NewsItem } from '../types';

// Initial state
const initialState = {
	items: [],
	loading: false,
	error: null
};

function createNewsStore() {
	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		loadNews: async () => {
			update(state => ({ ...state, loading: true }));
			try {
				// In the future, this will fetch from an API
				const mockNews = [ /* your mock news items */];
				update(state => ({ ...state, items: mockNews, loading: false }));
			} catch (error) {
				update(state => ({ ...state, error, loading: false }));
			}
		},
		submitNewsLink: async (url: string) => {
			try {
				const response = await fetch('/api/submit-link', {
					method: 'POST',
					body: JSON.stringify({ url }),
					headers: { 'Content-Type': 'application/json' }
				});
				return await response.json();
			} catch (error) {
				console.error('Error submitting news link:', error);
				throw error;
			}
		}
	};
}

export const newsStore = createNewsStore();