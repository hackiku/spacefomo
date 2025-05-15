// src/lib/hooks/useFomoNews.svelte.ts
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import type { NewsItem } from '$lib/types/news';

export function useFomoNews() {
	// Get the FOMO context we updated
	const fomoContext = getFomoContext();

	// Destructure what we need from the context
	const {
		newsItems,
		filteredNews,
		dailyFomoData,
		fomoThreshold,
		startDate,
		endDate,
		activeWeekNumber,
		currentWeek,
		setFomoThreshold,
		setDateRange,
		setActiveWeek
	} = fomoContext;

	// State for the visualization 
	let visualizationType = $state<'bar' | 'line' | 'heatmap'>('bar');
	let isExpanded = $state(false);

	// Methods to manage visualization state
	function setVisualizationType(type: 'bar' | 'line' | 'heatmap') {
		visualizationType = type;
	}

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	// Get current FOMO score (average of filtered news)
	const currentFomoScore = $derived(() => {
		if (filteredNews.length === 0) return 0;

		const totalScore = filteredNews.reduce((sum, article) =>
			sum + (article.fomo_score || 0), 0);

		return Math.round(totalScore / filteredNews.length);
	});

	// Getting the most recent articles (for timeline display)
	const recentArticles = $derived(() => {
		return [...filteredNews]
			.sort((a, b) => {
				const dateA = a.publication_date ? new Date(a.publication_date).getTime() : 0;
				const dateB = b.publication_date ? new Date(b.publication_date).getTime() : 0;
				return dateB - dateA;
			})
			.slice(0, 20); // Just get top 20 most recent articles for display
	});

	// Format data for timeline visualization
	const timelineData = $derived(() => {
		return dailyFomoData.map(day => ({
			date: day.date,
			score: day.score,
			count: day.newsCount
		}));
	});

	// Prepare data specifically for barTimeline format
	const barTimelineData = $derived(() => {
		// Get last 365 days or as many as we have
		const days = dailyFomoData.slice(-365);

		// If no data, generate empty placeholders
		if (days.length === 0) {
			return Array.from({ length: 365 }, (_, i) => {
				const date = new Date();
				date.setDate(date.getDate() - (365 - i));

				return {
					date,
					score: 0,
					weekNumber: Math.floor(i / 7),
					dayIndex: i % 7
				};
			});
		}

		// Calculate week numbers relative to most recent date
		const mostRecentDate = new Date(Math.max(...days.map(d => d.date.getTime())));
		const oldestDate = new Date(Math.min(...days.map(d => d.date.getTime())));
		const daysBetween = Math.ceil((mostRecentDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
		const weeksBetween = Math.ceil(daysBetween / 7);

		// Map the data to the format BarTimeline expects
		return days.map((day, index) => {
			const daysFromOldest = Math.ceil((day.date.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
			const weekNumber = Math.floor(daysFromOldest / 7);
			const dayIndex = daysFromOldest % 7;

			return {
				date: day.date,
				score: day.score,
				weekNumber,
				dayIndex
			};
		});
	});

	return {
		// Data
		newsItems,
		filteredNews,
		timelineData,
		barTimelineData,
		recentArticles,

		// State
		currentFomoScore,
		fomoThreshold,
		startDate,
		endDate,
		activeWeekNumber,
		currentWeek,
		visualizationType,
		isExpanded,

		// Methods
		setFomoThreshold,
		setDateRange,
		setActiveWeek,
		setVisualizationType,
		toggleExpanded
	};
}