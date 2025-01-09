// $lib/data/newsData.ts
import type { NewsItem } from '$lib/types';

export const mockNewsItems: NewsItem[] = [
	{
		id: "1",
		title: "W Boson Mystery Solved: Standard Model Prevails",
		summary: "LHC confirms W boson mass matches Standard Model predictions, contradicting earlier Fermilab results.",
		tldr: "LHC confirms W boson mass matches Standard Model, closing potential avenue for new physics theories.",
		score: 95,
		url: "https://example.com/w-boson-mystery-solved",
		tags: ["particle physics", "LHC", "Standard Model"],
		source: "CERN",
		readTime: "4m",
		dataPoints: [
			{ label: "W Boson Mass", value: "80,360.2 ± 9.9 MeV" },
			{ label: "Standard Model Prediction", value: "80,357 ± 6 MeV" }
		],
		type: "research" // New field for categorization
	},
	{
		id: "2",
		title: "SpaceX Announces New Heavy Launch Vehicle",
		summary: "Revolutionary new rocket design promises 50% more payload capacity to LEO.",
		tldr: "SpaceX unveils next-gen rocket with unprecedented lifting power.",
		score: 88,
		url: "https://example.com/spacex-new-rocket",
		tags: ["spacex", "rockets", "innovation"],
		source: "SpaceX",
		readTime: "3m",
		dataPoints: [
			{ label: "Payload Capacity", value: "150 tons" },
			{ label: "First Launch", value: "Q4 2025" }
		],
		type: "industry"
	},
	{
		id: "3",
		title: "NASA's Webb Telescope Finds Earth-like Planet",
		summary: "New exoplanet discovery shows promising signs of habitability.",
		tldr: "Webb telescope identifies potentially habitable exoplanet in Goldilocks zone.",
		score: 92,
		url: "https://example.com/webb-exoplanet",
		tags: ["astronomy", "exoplanets", "webb"],
		source: "NASA",
		readTime: "5m",
		dataPoints: [
			{ label: "Distance", value: "40 light years" },
			{ label: "Size", value: "1.2x Earth" }
		],
		type: "discovery"
	},
	{
		id: "4",
		title: "New Quantum Computing Breakthrough",
		summary: "Scientists achieve room-temperature quantum entanglement.",
		tldr: "Major advancement in practical quantum computing achieved.",
		score: 89,
		url: "https://example.com/quantum-breakthrough",
		tags: ["quantum", "computing", "physics"],
		source: "Nature",
		readTime: "6m",
		dataPoints: [
			{ label: "Coherence Time", value: "1.2 seconds" },
			{ label: "Temperature", value: "294K" }
		],
		type: "research"
	}
];

export const featuredNews = {
	id: 'featured-1',
	title: 'SpaceX successfully lands Starship after orbital test flight',
	summary: 'In a historic achievement, SpaceX has successfully completed a full test flight of its Starship vehicle, marking a major milestone in the development of the world\'s most powerful rocket system.',
	source: 'Space News',
	readTime: '1 min read',
	url: '#',
	score: 95,
	date: '2024-01-08',
	tags: ['SpaceX', 'Starship', 'Launch'],
	dataPoints: [
		{ label: 'Flight Duration', value: '1h 30m' },
		{ label: 'Max Altitude', value: '250 km' },
		{ label: 'Landing Accuracy', value: '< 100m' },
		{ label: 'Reuse Timeline', value: '2 weeks' }
	]
};


export const articleTypes = {
	research: "Scientific Research",
	industry: "Industry News",
	discovery: "Space Discoveries",
	technology: "Technology Updates"
} as const;