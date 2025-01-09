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

export interface WeekData {
	id: number
	startDate: Date
	endDate: Date
	score: number
	stats: {
		launchActivity: number
		industryBuzz: number
		techImpact: number
	}
}

export interface FomoState {
	currentScore: number
	currentWeekIndex: number
	weeks: WeekData[]
	nextUpdate: number
}

export type CardStyle = 'minimal' | 'terminal'