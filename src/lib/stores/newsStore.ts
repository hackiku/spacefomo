// src/lib/stores/newsStore.ts
import { writable, derived } from 'svelte/store';

export interface NewsItem {
	id: number;
	title: string;
	url: string;
	source: string;
	readTime: number;
	score: number;
	tags: string[];
	weekId: number;
	createdAt: Date;
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
		items: [
			{
				id: 1,
				title: "SpaceX successfully launches Starship to orbit for the first time",
				url: "https://www.space.com/spacex-starship",
				source: "Space.com",
				readTime: 2,
				score: 39,
				tags: ["launch", "spacex", "starship"],
				weekId: 5,
				createdAt: new Date()
			},
			{
				id: 2,
				title: "Blue Origin reveals new heavy-lift rocket details",
				url: "https://www.space.com/blue-origin-new-glenn",
				source: "r/aerospace",
				readTime: 7,
				score: 82,
				tags: ["development", "blue-origin", "new-glenn"],
				weekId: 5,
				createdAt: new Date()
			}
		],
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
				items = items.filter(item => item.weekId === $state.filter.weekId);
			}

			if ($state.filter.tags.length) {
				items = items.filter(item =>
					$state.filter.tags.some(tag => item.tags.includes(tag))
				);
			}

			return items.sort((a, b) => b.score - a.score);
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
			update(state => ({ ...state, items: news }))
	};
};

export const newsStore = createNewsStore();