// src/lib/hooks/useNews.svelte.ts
import type { NewsItem } from '$lib/stores/newsStore';
import { supabase } from '$lib/supabaseClient';

export function useNews() {
	// State
	let items = $state<NewsItem[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let activeItemId = $state<number | null>(null);
	let filter = $state({
		weekId: null as number | null,
		tags: [] as string[]
	});

	// Derived values
	const activeItem = $derived(
		items.find(item => item.id === activeItemId)
	);

	const filteredItems = $derived(() => {
		let filtered = [...items];

		// Filter by week if specified
		if (filter.weekId !== null) {
			filtered = filtered.filter(item => item.week_id === filter.weekId);
		}

		// Filter by tags if any are selected
		if (filter.tags.length > 0) {
			filtered = filtered.filter(item =>
				item.tags?.some(tag => filter.tags.includes(tag))
			);
		}

		// Sort by FOMO score (descending)
		return filtered.sort((a, b) => {
			const scoreA = a.fomo_score ?? -Infinity;
			const scoreB = b.fomo_score ?? -Infinity;
			return scoreB - scoreA;
		});
	});

	// Load news data
	async function loadNews() {
		isLoading = true;
		error = null;
		try {
			// Use supabase client directly
			const { data, error: supabaseError } = await supabase
				.from('space_news')  // Use your new table name
				.select('*')
				.order('fomo_score', { ascending: false });

			if (supabaseError) throw supabaseError;

			// Transform dates to Date objects
			items = data.map(item => ({
				...item,
				created_at: new Date(item.created_at),
				publication_date: item.publication_date ? new Date(item.publication_date) : null
			}));
		} catch (e) {
			console.error('Error loading news:', e);
			error = e instanceof Error ? e.message : 'Unknown error loading news';
		} finally {
			isLoading = false;
		}
	}

	// Set active item
	function setActiveItem(id: number | null) {
		activeItemId = id;
	}

	// Set filter
	function setFilter(weekId: number | null, tags: string[] = []) {
		filter = { weekId, tags };
	}

	// Initial data load
	$effect(() => {
		loadNews();
	});

	// Return the hook API
	return {
		items,
		filteredItems,
		isLoading,
		error,
		activeItem,
		setActiveItem,
		setFilter,
		refresh: loadNews
	};
}