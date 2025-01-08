// src/lib/types/index.ts

export interface NewsItem {
	id: string
	title: string
	url: string
	summary: string
	source: string
	score: number
	date: string
	readTime: string
	tags: string[]
	dataPoints?: Array<{
		label: string
		value: string
	}>
}

export type FomoScore = {
	value: number
	date: string
}

export type CardStyle = 'minimal' | 'terminal'