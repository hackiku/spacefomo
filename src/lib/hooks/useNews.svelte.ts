// src/lib/hooks/useNews.svelte.ts
import { fetchNews, fetchNewsById } from '$lib/services/news/newsService';
import { getNewsContext } from '$lib/context/newsContext.svelte';
import type { NewsItem } from '$lib/types/news';

export function useNews() {
	// Get the context
	const context = getNewsContext();

	// Destructure what we need from context
	const {
		items,
		activeItem,
		isLoading,
		error,
		setItems,
		setActiveItem,
		setLoading,
		setError
	} = context;

	// Our filters state (local to this hook instance)
	let filters = $state({
		limit: 50,
		offset: 0,
		tags: [] as string[],
		weekId: null as number | null,
		minScore: 0
	});

	// Load news data
	async function loadNews() {
		setLoading(true);
		setError(null);

		try {
			const result = await fetchNews(filters);
			setItems(result.items);
		} catch (e) {
			console.error('Error loading news:', e);
			setError(e instanceof Error ? e.message : 'Unknown error loading news');
		} finally {
			setLoading(false);
		}
	}

	// Update filters and reload data
	function setFilters(newFilters: Partial<typeof filters>) {
		filters = { ...filters, ...newFilters };
		loadNews();
	}

	// Load initial data if not already loaded
	$effect(() => {
		if (items.length === 0 && !isLoading && !error) {
			loadNews();
		}
	});

	// Return the API
	return {
		items,
		activeItem,
		isLoading,
		error,
		filters,
		setActiveItem,
		setFilters,
		refresh: loadNews
	};
}