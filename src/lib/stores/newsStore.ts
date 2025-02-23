// src/lib/stores/newsStore.ts
import { writable, derived, type Readable } from 'svelte/store';

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

interface NewsStoreState {
	items: NewsItem[];
	activeItemId: number | null;
	filter: {
		weekId: number | null;
		tags: string[];
	};
}

interface NewsStore extends Readable<NewsStoreState> {
	filteredItems: Readable<NewsItem[]>;
	setFilter: (weekId: number | null, tags?: string[]) => void;
	setActiveItem: (id: number | null) => void;
	initializeNews: (news: NewsItem[]) => void;
}

const createNewsStore = (): NewsStore => {
	const { subscribe, set, update } = writable<NewsStoreState>({
		items: [],
		activeItemId: null,
		filter: {
			weekId: null,
			tags: []
		}
	});

	const filteredItems = derived<Readable<NewsStoreState>, NewsItem[]>(
		{ subscribe },
		($state) => {
			let items = $state.items;

			// Filter by week if specified
			if ($state.filter.weekId !== null) {
				items = items.filter(item => item.week_id === $state.filter.weekId);
			}

			// Filter by tags if any are selected
			if ($state.filter.tags.length > 0) {
				items = items.filter(item =>
					item.tags?.some(tag => $state.filter.tags.includes(tag))
				);
			}

			// Sort by FOMO score (descending), handling null values
			return items.sort((a, b) => {
				const scoreA = a.fomo_score ?? -Infinity;
				const scoreB = b.fomo_score ?? -Infinity;
				return scoreB - scoreA;
			});
		}
	);

	return {
		subscribe,
		filteredItems,
		setFilter: (weekId: number | null, tags: string[] = []) =>
			update(state => ({
				...state,
				filter: { weekId, tags }
			})),
		setActiveItem: (id: number | null) =>
			update(state => ({
				...state,
				activeItemId: id
			})),
		initializeNews: (news: NewsItem[]) =>
			set({
				items: news.map(item => ({
					...item,
					created_at: new Date(item.created_at),
					publication_date: item.publication_date ? new Date(item.publication_date) : null
				})),
				activeItemId: null,
				filter: { weekId: null, tags: [] }
			})
	};
};

export const newsStore = createNewsStore();