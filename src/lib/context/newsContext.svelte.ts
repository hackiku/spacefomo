// src/lib/context/newsContext.ts

import { getContext } from 'svelte';
import type { NewsItem } from '$lib/types/news';

export function createNewsContext(initialData: NewsItem[] = []) {
	// Core state
	let items = $state<NewsItem[]>(initialData);
	let activeItemId = $state<number | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Derived values
	const activeItem = $derived(
		items.find(item => item.id === activeItemId)
	);

	// Methods
	function setItems(newItems: NewsItem[]) {
		items = newItems.map(item => ({
			...item,
			created_at: item.created_at instanceof Date ? item.created_at : new Date(item.created_at),
			publication_date: item.publication_date ?
				(item.publication_date instanceof Date ? item.publication_date : new Date(item.publication_date)) :
				null
		}));
	}

	function setActiveItem(id: number | null) {
		activeItemId = id;
	}

	function setLoading(loading: boolean) {
		isLoading = loading;
	}

	function setError(err: string | null) {
		error = err;
	}

	// Initialize with the data if provided
	if (initialData.length > 0) {
		setItems(initialData);
	}

	return {
		// State
		items,
		activeItem,
		isLoading,
		error,

		// Methods
		setItems,
		setActiveItem,
		setLoading,
		setError
	};
}

// Helper to get the news context
export function getNewsContext() {
	return getContext<ReturnType<typeof createNewsContext>>('news');
}