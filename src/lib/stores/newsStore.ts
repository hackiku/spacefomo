// src/lib/stores/newsStore.ts
import { writable, derived } from 'svelte/store';

export interface NewsItem {
	id: number;
	title: string;
	url: string;
	source: string | null;
	read_time: number | null;
	fomo_score: number | null;
	tags: string[] | null;
	week_id: number | null;
	created_at: Date;
	entities: Record<string, any> | null;
	context: Record<string, any> | null;
	impact_score: number | null;
	publication_date: Date | null;
	viral_title: string | null;
}

const createNewsStore = () => {
	const { subscribe, set, update } = writable<{
		items: NewsItem[];
		activeItemId: number | null;
		filter: {
			weekId: number | null;
			tags: string[];
		};
	}>({
		items: [],
		activeItemId: null,
		filter: {
			weekId: null,
			tags: []
		}
	});

	const filteredItems = derived(
		{ subscribe },
		($state) => {
			let items = $state.items;

			if ($state.filter.weekId) {
				items = items.filter(item => item.week_id === $state.filter.weekId);
			}

			if ($state.filter.tags.length && items[0]?.tags) {
				items = items.filter(item =>
					item.tags && $state.filter.tags.some(tag => item.tags.includes(tag))
				);
			}

			return items.sort((a, b) => (b.fomo_score ?? 0) - (a.fomo_score ?? 0));
		}
	);

	return {
		subscribe,
		filteredItems,
		setFilter: (weekId: number | null, tags: string[] = []) =>
			update(state => ({ ...state, filter: { weekId, tags } })),
		setActiveItem: (id: number | null) =>
			update(state => ({ ...state, activeItemId: id })),
		initializeNews: (news: NewsItem[]) =>
			set({ items: news, activeItemId: null, filter: { weekId: null, tags: [] } })
	};
};

export const newsStore = createNewsStore();