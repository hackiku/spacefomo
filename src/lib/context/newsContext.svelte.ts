// src/lib/context/newsContext.svelte.ts
import { getContext, setContext } from 'svelte';
import type { NewsItem } from '$lib/types/news';

export function createNewsContext(initialNews: NewsItem[] = []) {
	// Core state with clear types
	let newsItems = $state<NewsItem[]>(initialNews);
	let activeItemId = $state<number | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Pagination state
	let currentPage = $state(1);
	let totalPages = $state(1);
	let hasMore = $derived(currentPage < totalPages);

	// Reactive derived values using $derived
	const activeItem = $derived(
		newsItems.find(item => item.id === activeItemId) || null
	);

	// Clear methods for data actions
	async function loadMore() {
		if (!hasMore || isLoading) return;

		isLoading = true;
		try {
			const response = await fetch(`/api/v1/news?page=${currentPage + 1}`);
			const data = await response.json();

			if (data.success) {
				newsItems = [...newsItems, ...data.data.items];
				currentPage = data.data.meta.currentPage;
				totalPages = data.data.meta.totalPages;
			} else {
				error = data.error;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			isLoading = false;
		}
	}

	function setActiveItem(id: number | null) {
		activeItemId = id;
	}

	function refreshData() {
		// Implementation to refresh data from API
	}

	return {
		// State
		newsItems,
		activeItemId,
		isLoading,
		error,
		currentPage,
		totalPages,

		// Derived values
		activeItem,
		hasMore,

		// Methods
		setActiveItem,
		loadMore,
		refreshData
	};
}

// Helper to get the news context
export function getNewsContext() {
	const context = getContext<ReturnType<typeof createNewsContext>>('news');
	if (!context) {
		throw new Error('getNewsContext must be used within a component with NewsContext');
	}
	return context;
}

// Helper to set up the news context
export function setupNewsContext(initialNews: NewsItem[] = []) {
	const context = createNewsContext(initialNews);
	setContext('news', context);
	return context;
}