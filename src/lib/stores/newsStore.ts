// $lib/stores/newsStore.ts
import { writable } from 'svelte/store';
import type { NewsItem } from '../types';

// Initial state
const initialState = {
	items: [],
	loading: false,
	error: null
};

function createNewsStore() {
	const { subscribe, set } = writable<NewsItem[]>([]);

	return {
		subscribe,
		set,
		refresh: async () => {
			const response = await fetch('/api/refresh-news', {
				method: 'POST'
			});
			const news = await response.json();
			set(news);
		}
	};
}

export const newsStore = createNewsStore();