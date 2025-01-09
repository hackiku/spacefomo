// lib/data/news.ts
import type { NewsItem } from '$lib/types';

export const ARTICLE_TYPES = {
	RESEARCH: 'research',
	INDUSTRY: 'industry',
	DISCOVERY: 'discovery',
	LAUNCH: 'launch',
	POLICY: 'policy'
} as const;

export const NEWS_ITEMS: NewsItem[] = [
	{
		id: '1',
		title: 'SpaceX successfully lands Starship after orbital test flight',
		summary: 'In a historic achievement, SpaceX has successfully completed a full test flight of its Starship vehicle, marking a major milestone in the development of the world\'s most powerful rocket system.',
		source: 'Space News',
		readTime: '1 min read',
		url: 'https://www.space.com/spacex-starship',
		score: 95,
		date: '2024-01-08',
		tags: ['SpaceX', 'Starship', 'Launch'],
		type: ARTICLE_TYPES.LAUNCH,
		dataPoints: [
			{ label: 'Flight Duration', value: '1h 30m' },
			{ label: 'Max Altitude', value: '250 km' },
			{ label: 'Landing Accuracy', value: '< 100m' },
			{ label: 'Reuse Timeline', value: '2 weeks' }
		]
	},
	{
		id: '2',
		title: 'NASA Confirms Water Ice Deposits at Lunar South Pole',
		summary: 'New analysis of data from the VIPER mission definitively shows accessible water ice deposits in permanently shadowed craters.',
		source: 'NASA',
		readTime: '2 min read',
		url: 'https://www.nasa.gov/moon',
		score: 92,
		date: '2024-01-07',
		tags: ['Moon', 'Water', 'VIPER'],
		type: ARTICLE_TYPES.DISCOVERY,
		dataPoints: [
			{ label: 'Ice Depth', value: '< 1 meter' },
			{ label: 'Deposit Size', value: '~ 10,000 m²' },
			{ label: 'Water Content', value: '> 90% pure' }
		]
	}
];

// You can also have featured/pinned items
export const FEATURED_NEWS = NEWS_ITEMS[0];

// Helper functions if needed
export function getNewsByType(type: string) {
	return NEWS_ITEMS.filter(item => item.type === type);
}

export function getRelatedNews(item: NewsItem) {
	return NEWS_ITEMS.filter(news =>
		news.id !== item.id &&
		(news.type === item.type ||
			news.tags.some(tag => item.tags.includes(tag)))
	).slice(0, 3);
}