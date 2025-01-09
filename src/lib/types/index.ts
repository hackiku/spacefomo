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

export interface WeekStats {
	launchActivity: number
	industryBuzz: number
	techImpact: number
}

export interface WeekData {
	id: number
	startDate: Date
	endDate: Date
	score: number
	stats: WeekStats
}

export interface FomoState {
	currentScore: number
	currentWeekIndex: number
	weeks: WeekData[]
	nextUpdate: number
}
