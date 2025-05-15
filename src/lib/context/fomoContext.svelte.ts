// src/lib/context/fomoContext.svelte.ts
import { getContext } from 'svelte';
import type { NewsItem } from '$lib/types/news';

// Type for calculated FOMO data
export type FomoData = {
	date: Date;
	score: number;
	newsCount: number;
};

// Weekly aggregation of FOMO data
export type FomoWeek = {
	id: number;          // Generated ID
	weekNumber: number;  // Week of year
	score: number;       // Average FOMO score for the week
	startDate: Date;     // First day of week
	endDate: Date;       // Last day of week
	summary: string;     // Auto-generated or empty
	stats: {
		launchActivity: number;
		industryBuzz: number;
		techImpact: number;
	};
	createdAt: Date;     // When this was calculated
	articles: NewsItem[]; // Articles in this week
};

export function createFomoContext(initialNewsData: NewsItem[] = []) {
	// Core state
	let newsItems = $state<NewsItem[]>([]);
	let fomoThreshold = $state<number>(50); // Default threshold
	let activeWeekNumber = $state<number | null>(null);
	let startDate = $state<Date | null>(null);
	let endDate = $state<Date | null>(null);
	let weeks = $state<FomoWeek[]>([]);

	// Derived values
	const currentWeek = $derived(
		weeks.find(week => week.weekNumber === activeWeekNumber)
	);

	// Filter news by date range and threshold
	const filteredNews = $derived(() => {
		return newsItems.filter(item => {
			// Filter by FOMO score threshold
			if (item.fomo_score !== null && item.fomo_score < fomoThreshold) {
				return false;
			}

			// Filter by date range if set
			if (startDate && endDate && item.publication_date) {
				const pubDate = new Date(item.publication_date);
				return pubDate >= startDate && pubDate <= endDate;
			}

			return true;
		});
	});

	// Calculate daily FOMO data
	const dailyFomoData = $derived(() => {
		const dataByDay = new Map<string, FomoData>();

		// Group by date
		filteredNews.forEach(item => {
			if (!item.publication_date) return;

			const dateString = new Date(item.publication_date).toISOString().split('T')[0];
			const existingData = dataByDay.get(dateString);

			if (existingData) {
				// Update existing data
				existingData.score += item.fomo_score || 0;
				existingData.newsCount += 1;
			} else {
				// Create new data point
				dataByDay.set(dateString, {
					date: new Date(item.publication_date),
					score: item.fomo_score || 0,
					newsCount: 1
				});
			}
		});

		// Calculate average scores
		return Array.from(dataByDay.values()).map(data => ({
			...data,
			score: data.newsCount > 0 ? Math.round(data.score / data.newsCount) : 0
		})).sort((a, b) => a.date.getTime() - b.date.getTime());
	});

	// Methods
	function setActiveWeek(weekNumber: number) {
		activeWeekNumber = weekNumber;
	}

	function setDateRange(start: Date | null, end: Date | null) {
		startDate = start;
		endDate = end;
	}

	function setFomoThreshold(threshold: number) {
		fomoThreshold = threshold;
	}

	// Calculate weekly aggregated data
	function calculateWeeks(newsData: NewsItem[]) {
		if (!newsData.length) return [];

		// Group by week
		const weekMap = new Map<number, NewsItem[]>();

		newsData.forEach(item => {
			if (!item.publication_date) return;

			const pubDate = new Date(item.publication_date);
			const weekStart = getWeekStart(pubDate);
			const weekNumber = getWeekNumber(pubDate);

			if (!weekMap.has(weekNumber)) {
				weekMap.set(weekNumber, []);
			}

			weekMap.get(weekNumber)?.push(item);
		});

		// Create week objects
		const calculatedWeeks = Array.from(weekMap.entries()).map(([weekNumber, articles], index) => {
			// Calculate start and end dates
			const firstArticleDate = new Date(Math.min(...articles.map(a =>
				new Date(a.publication_date || Date.now()).getTime()
			)));
			const weekStart = getWeekStart(firstArticleDate);
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekStart.getDate() + 6);

			// Calculate average FOMO score
			const totalScore = articles.reduce((sum, article) => sum + (article.fomo_score || 0), 0);
			const avgScore = articles.length > 0 ? Math.round(totalScore / articles.length) : 0;

			return {
				id: index + 1, // Generate sequential IDs
				weekNumber,
				score: avgScore,
				startDate: weekStart,
				endDate: weekEnd,
				summary: `Week ${weekNumber} - ${articles.length} articles`,
				stats: {
					launchActivity: Math.round(Math.random() * 100), // Placeholder
					industryBuzz: Math.round(Math.random() * 100), // Placeholder  
					techImpact: Math.round(Math.random() * 100) // Placeholder
				},
				createdAt: new Date(),
				articles
			};
		});

		return calculatedWeeks.sort((a, b) => b.weekNumber - a.weekNumber);
	}

	// Helper: Get start of week (Sunday) for a given date
	function getWeekStart(date: Date): Date {
		const result = new Date(date);
		const day = result.getDay();
		result.setDate(result.getDate() - day); // Go to Sunday
		return result;
	}

	// Helper: Get week number (1-52)
	function getWeekNumber(date: Date): number {
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		const dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
	}

	// Initialize the context with data
	function initializeWithNews(newItems: NewsItem[]) {
		// Process news items to ensure dates are proper Date objects
		newsItems = newItems.map(item => ({
			...item,
			created_at: item.created_at instanceof Date ? item.created_at : new Date(item.created_at),
			publication_date: item.publication_date ?
				(item.publication_date instanceof Date ? item.publication_date : new Date(item.publication_date)) :
				null
		}));

		// Calculate weekly data
		weeks = calculateWeeks(newsItems);

		// Set active week to the most recent one
		if (weeks.length > 0) {
			activeWeekNumber = weeks[0].weekNumber;
		}
	}

	// Initialize with data if provided
	if (initialNewsData.length > 0) {
		initializeWithNews(initialNewsData);
	}

	return {
		// State
		newsItems,
		weeks,
		activeWeekNumber,
		currentWeek,
		fomoThreshold,
		startDate,
		endDate,

		// Derived data
		filteredNews,
		dailyFomoData,

		// Methods
		setActiveWeek,
		setDateRange,
		setFomoThreshold,
		initializeWithNews
	};
}

// Helper to get the fomo context
export function getFomoContext() {
	return getContext<ReturnType<typeof createFomoContext>>('fomo');
}

// Helper to create a hook for fomo data
export function useFomo() {
	const context = getFomoContext();

	if (!context) {
		throw new Error('useFomo must be used within a component with FomoContext');
	}

	return context;
}