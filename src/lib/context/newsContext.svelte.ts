// src/lib/context/newsContext.svelte.ts
import { getContext } from 'svelte';
import type { NewsItem } from '$lib/types/news';

export function createNewsContext(initialNews: NewsItem[] = [], initialProcessedNews: NewsItem[] = []) {
	// Core state
	let newsItems = $state<NewsItem[]>(initialNews);
	let processedNewsItems = $state<NewsItem[]>(initialProcessedNews);
	let activeItemId = $state<number | null>(null);
	let activeDataSource = $state<'news' | 'processed_news'>('news');
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Current items based on active data source
	const currentItems = $derived(() => {
		return activeDataSource === 'news' ? newsItems : processedNewsItems;
	});

	// Methods
	function setNewsItems(items: NewsItem[]) {
		newsItems = items.map(processNewsItem);
	}

	function setProcessedNewsItems(items: NewsItem[]) {
		processedNewsItems = items.map(processNewsItem);
	}

	function setActiveDataSource(source: 'news' | 'processed_news') {
		activeDataSource = source;
	}

	function setActiveItem(id: number | null) {
		activeItemId = id;
	}

	function getActiveItem() {
		const items = activeDataSource === 'news' ? newsItems : processedNewsItems;
		return items.find(item => item.id === activeItemId) || null;
	}

	// Helper to process dates in news items
	function processNewsItem(item: NewsItem): NewsItem {
		return {
			...item,
			created_at: item.created_at instanceof Date ?
				item.created_at : new Date(item.created_at),
			publication_date: item.publication_date ?
				(item.publication_date instanceof Date ?
					item.publication_date : new Date(item.publication_date)) : null
		};
	}

	// Initialize with data if provided
	if (initialNews.length > 0) {
		setNewsItems(initialNews);
	}

	if (initialProcessedNews.length > 0) {
		setProcessedNewsItems(initialProcessedNews);
	}

	return {
		// State
		newsItems,
		processedNewsItems,
		currentItems,
		activeItemId,
		activeDataSource,
		isLoading,
		error,

		// Methods
		setNewsItems,
		setProcessedNewsItems,
		setActiveDataSource,
		setActiveItem,
		getActiveItem
	};
}

// Helper to get the news context
export function getNewsContext() {
	return getContext<ReturnType<typeof createNewsContext>>('news');
}