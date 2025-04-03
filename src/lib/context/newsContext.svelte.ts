// src/lib/context/newsContext.svelte.ts
import { getContext } from 'svelte';
import type { NewsItem } from '$lib/types/news';

export function createNewsContext(initialData: NewsItem[] = []) {
	// Core state
	let items = $state<NewsItem[]>(initialData);
	let activeItemId = $state<number | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	console.log('Creating news context with items:', initialData.length);

	// Methods
	function setItems(newItems: NewsItem[]) {
		console.log('Setting news items:', newItems.length);
		items = newItems.map(item => ({
			...item,
			created_at: item.created_at instanceof Date ? item.created_at : new Date(item.created_at),
			publication_date: item.publication_date ?
				(item.publication_date instanceof Date ? item.publication_date : new Date(item.publication_date)) :
				null
		}));
	}

	function setActiveItem(id: number | null) {
		console.log('Context setActiveItem called with ID:', id);
		activeItemId = id;
	}

	function getActiveItem() {
		console.log('getActiveItem called, looking for ID:', activeItemId);
		return items.find(item => item.id === activeItemId) || null;
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
		activeItemId,
		getActiveItem,  // Method instead of derived value
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
	const context = getContext<ReturnType<typeof createNewsContext>>('news');
	console.log('getNewsContext called, context exists:', !!context);
	return context;
}