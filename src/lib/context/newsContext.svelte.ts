// src/lib/context/newsContext.svelte.ts
import { getContext, setContext } from 'svelte';
import { trpc } from '$lib/trpc/client';
import type { NewsItem } from '$lib/types/news';

export function createNewsContext(initialNews: NewsItem[] = []) {
	// Core state with clean reactivity
	let newsItems = $state<NewsItem[]>(initialNews);
	let activeItemId = $state<number | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Pagination state from API
	let currentPage = $state(1);
	let totalPages = $state(1);
	let totalCount = $state(initialNews.length);
	let pageSize = $state(20);

	// Calculate derived values
	const hasMore = $derived(currentPage < totalPages);
	const activeItem = $derived(newsItems.find(item => item.id === activeItemId) || null);

	// Load more items using tRPC
	async function loadMore() {
		if (isLoading || !hasMore) return;
		isLoading = true;

		try {
			console.log(`Loading more news items, page ${currentPage + 1}`);

			const result = await trpc().getNews.query({
				page: currentPage + 1,
				limit: pageSize,
				minScore: 0 // No filtering at the API level
			});

			if (result) {
				// Append new items without duplicates
				const newItems = result.items.filter(
					newItem => !newsItems.some(existingItem => existingItem.id === newItem.id)
				);

				newsItems = [...newsItems, ...newItems];
				currentPage = result.meta.page;
				totalPages = result.meta.totalPages;
				totalCount = result.meta.totalCount;

				console.log(`Loaded ${newItems.length} new items, total: ${newsItems.length}`);
			}
		} catch (err) {
			console.error('Error loading more news:', err);
			error = err instanceof Error ? err.message : 'Failed to load news';
		} finally {
			isLoading = false;
		}
	}

	// Get a specific news item by ID
	async function getNewsItem(id: number) {
		// First check if we already have it
		const existingItem = newsItems.find(item => item.id === id);
		if (existingItem) return existingItem;

		// Otherwise fetch it
		isLoading = true;

		try {
			// Here you would implement a tRPC call to get a specific news item
			// const item = await trpc().getNewsItem.query({ id });
			// return item;

			// For now, just return null
			return null;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load news item';
			return null;
		} finally {
			isLoading = false;
		}
	}

	// Set active item
	function setActiveItem(id: number | null) {
		activeItemId = id;
	}

	// Refresh data
	async function refreshData() {
		isLoading = true;

		try {
			const result = await trpc().getNews.query({
				page: 1,
				limit: pageSize,
				minScore: 0
			});

			if (result) {
				newsItems = result.items;
				currentPage = result.meta.page;
				totalPages = result.meta.totalPages;
				totalCount = result.meta.totalCount;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to refresh news';
		} finally {
			isLoading = false;
		}
	}

	// Return the context with getters for reactivity
	return {
		// Reactive state through getters
		get newsItems() { return newsItems; },
		get activeItemId() { return activeItemId; },
		get isLoading() { return isLoading; },
		get error() { return error; },
		get currentPage() { return currentPage; },
		get totalPages() { return totalPages; },
		get totalCount() { return totalCount; },
		get pageSize() { return pageSize; },

		// Derived values
		get hasMore() { return hasMore; },
		get activeItem() { return activeItem; },

		// Actions
		setActiveItem,
		loadMore,
		refreshData,
		getNewsItem
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

// Helper to set up the news context - convenience function
export function setupNewsContext(initialNews: NewsItem[] = []) {
	const context = createNewsContext(initialNews);
	setContext('news', context);
	return context;
}