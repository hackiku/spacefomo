// src/lib/server/db/mockDb.ts
import type { NewsItem } from '$lib/types';
import { writable } from 'svelte/store';

// Initialize with an empty array
export const newsItems = writable<NewsItem[]>([]);

export function addNewsItem(item: NewsItem) {
	newsItems.update(items => [...items, item]);
}

export function getNewsItems() {
	return new Promise<NewsItem[]>(resolve => {
		newsItems.subscribe(value => {
			resolve(value);
		})();
	});
}