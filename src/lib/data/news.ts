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
		id: 'blushift-2025',
		title: 'BluShift Aerospace hopes to launch 1st suborbital rocket from Maine in 2025',
		summary: 'BluShift Aerospace is making significant strides in sustainable spaceflight, preparing for their first suborbital launch using proprietary bio-derived fuel technology. Following successful MAREVL engine tests, the company has secured new funding and aims to demonstrate their innovative approach to commercial space access.',
		source: 'Space.com',
		readTime: 5,
		url: 'https://www.space.com/space-exploration/launches-spacecraft/blushift-aerospace-hopes-to-launch-1st-suborbital-rocket-from-maine-in-2025',
		score: 75,
		date: '2025-01-06',
		tags: ['BluShift', 'Suborbital', 'Biofuel', 'Maine'],
		type: ARTICLE_TYPES.LAUNCH,
		dataPoints: [
			{ label: 'Initial Launch Target', value: 'Late 2025' },
			{ label: 'Initial Altitude', value: '120-140 km' },
			{ label: 'Future Altitude', value: '350-400 km' },
			{ label: 'Recent Funding', value: '$1.4M' },
			{ label: 'Equity Round', value: '$15M' },
			{ label: 'Zero-G Time', value: '6-8 minutes' }
		]
	},
	{
		id: '1',
		title: 'SpaceX successfully lands Starship after orbital test flight',
		summary: 'In a historic achievement, SpaceX has successfully completed a full test flight of its Starship vehicle, marking a major milestone in the development of the world\'s most powerful rocket system.',
		source: 'Space News',
		readTime: 1,
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
		readTime: 2,
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
	},
	{
		id: '3',
		title: 'ESA Updates Mars Sample Return Timeline',
		summary: 'European Space Agency revises Mars Sample Return mission schedule, citing technical challenges with the Earth Return Orbiter.',
		source: 'ESA',
		readTime: '2 min read',
		url: 'https://www.esa.int/mars-sample',
		score: 78,
		date: '2024-01-06',
		tags: ['Mars', 'ESA', 'Sample Return'],
		type: ARTICLE_TYPES.INDUSTRY,
		dataPoints: [
			{ label: 'New Launch Date', value: '2028' },
			{ label: 'Sample Return', value: '2033' },
			{ label: 'Budget Change', value: '+€350M' }
		]
	},
	{
		id: '4',
		title: 'Amateur Astronomer Spots New Jupiter Impact Event',
		summary: 'Brazilian amateur astronomer documents potential impact flash in Jupiter\'s southern hemisphere, awaiting confirmation from professional observatories.',
		source: 'Sky & Telescope',
		readTime: '3 min read',
		url: 'https://skyandtelescope.org/jupiter-impact',
		score: 72,
		date: '2024-01-05',
		tags: ['Jupiter', 'Amateur Astronomy', 'Impact'],
		type: ARTICLE_TYPES.DISCOVERY,
		dataPoints: [
			{ label: 'Event Duration', value: '2.1 seconds' },
			{ label: 'Location', value: '47°S' },
			{ label: 'Equipment Used', value: '11" Dobsonian' }
		]
	},
	{
		id: '5',
		title: 'China Delays Lunar South Pole Mining Plans',
		summary: 'CNSA releases preliminary roadmap for lunar resource extraction, focusing on water ice and rare earth elements in permanently shadowed craters.',
		source: 'Space Policy Online',
		readTime: '4 min read',
		url: 'https://spacepolicy.com/china-lunar-mining',
		score: 65,
		date: '2024-01-04',
		tags: ['China', 'Moon', 'Mining'],
		type: ARTICLE_TYPES.POLICY,
		dataPoints: [
			{ label: 'Initial Investment', value: '¥12.5B' },
			{ label: 'Target Date', value: '2029' },
			{ label: 'Resource Focus', value: 'He-3, Water Ice' }
		]
	}
];

// Featured news selection
export const FEATURED_NEWS = NEWS_ITEMS[0];

// Helper functions
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