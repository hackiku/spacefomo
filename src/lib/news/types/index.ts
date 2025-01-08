// $lib/types/index.ts

export interface NewsItem {
	id: string;
	title: string;
	summary: string;
	tldr: string;
	score: number;
	url: string;
	tags: string[];
	source: string;
	readTime: string;
	dataPoints: DataPoint[];
}

export interface DataPoint {
	label: string;
	value: string;
}

export interface FomoScore {
	score: number;
	date: string;
	timeRemaining: number;
}

export interface SubmitNewsResponse {
	success: boolean;
	message: string;
	newsItem?: NewsItem;
}