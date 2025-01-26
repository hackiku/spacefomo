// src/lib/types/index.ts

export const ARTICLE_TYPES = {
	RESEARCH: '🧪 Research',
	INDUSTRY: '🏭 Industry',
	DISCOVERY: '🔭 Discovery',
	LAUNCH: '🚀 Launch',
	POLICY: '⚖️ Policy'
} as const;

export const ARTICLE_STATUS = {
	LOADED: 'Loaded',
	MODERATED: 'Moderated',
	REVIEW: 'Review',
	DRAFT: 'Draft',
	PUBLISHED: 'Published',
	FEATURED: 'Featured',
	ARCHIVED: 'Archived'
} as const;

export type ArticleType = typeof ARTICLE_TYPES[keyof typeof ARTICLE_TYPES];
export type ArticleStatus = typeof ARTICLE_STATUS[keyof typeof ARTICLE_STATUS];

export interface NewsItem {
	// Required fields (from initial submission)
	id: string
	title: string
	url: string

	// Optional fields (added by pipelines)
	summary?: string
	type?: ArticleType
	status?: ArticleStatus
	createdTime?: string
	week?: number
	readTime?: number
	score?: number
	date?: string
	source?: string // Single select from predefined options
	tags?: string[]
	weeklyRank?: number
	dataPoints?: Array<{
		label?: string
		value?: string
	}>
}


// FOMO related types
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

// SvelteKit generated types
// You don't need to define PageData yourself - it's generated from your +page.server.ts
// import type { PageData } from './$types'; 