// src/lib/hooks/useNews.svelte.ts
import { fetchNews, fetchNewsById } from '$lib/services/news/newsService';
import type { NewsItem } from '$lib/types/news';

export function useNews(initialData: NewsItem[] = []) {
	// State
	let items = $state<NewsItem[]>(initialData);
	let isLoading = $state(initialData.length === 0);
	let error = $state<string | null>(null);
	let activeItemId = $state<number | null>(null);
	let filters = $state({
		limit: 50,
		offset: 0,
		tags: [] as string[],
		weekId: null as number | null,
		minScore: 0
	});

	// Derived values
	const activeItem = $derived(
		items.find(item => item.id === activeItemId)
	);

	// Load news data
	async function loadNews() {
		// Set loading state first
		isLoading = true;
		error = null;

		try {
			const result = await fetchNews(filters);

			// Process dates for proper display
			const processedItems = result.items.map(item => ({
				...item,
				created_at: new Date(item.created_at),
				publication_date: item.publication_date ? new Date(item.publication_date) : null
			}));

			// Update items after processing
			items = processedItems;
		} catch (e) {
			console.error('Error loading news:', e);
			error = e instanceof Error ? e.message : 'Unknown error loading news';
		} finally {
			// Always update loading state when done
			isLoading = false;
		}
	}

	// Set active item
	function setActiveItem(id: number | null) {
		activeItemId = id;
	}

	// Update filters and reload data
	function setFilters(newFilters: Partial<typeof filters>) {
		// Create a new object to ensure reactivity
		filters = { ...filters, ...newFilters };
		// Load news with the updated filters
		loadNews();
	}

	// Initial data load if no data was provided
	$effect(() => {
		if (initialData.length === 0) {
			loadNews();
		}
	});

	// Return the hook API
	return {
		items,
		isLoading,
		error,
		activeItem,
		filters,
		setActiveItem,
		setFilters,
		refresh: loadNews
	};
}