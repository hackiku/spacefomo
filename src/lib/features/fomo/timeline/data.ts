// src/lib/features/fomo/timeline/data.ts

// Types
export type FomoDay = {
	date: Date;
	score: number;
	weekNumber: number;
	dayIndex: number;
};

export type FomoWeek = {
	id: number;
	weekNumber: number;
	score: number;
	startDate: Date;
	endDate: Date;
	days: FomoDay[];
};

// Generate fake FOMO data for the timeline
export function generateFomoData(days = 365) {
	const fomoData: FomoDay[] = [];

	// Generate a base date (today) and work backwards
	const today = new Date();

	for (let i = 0; i < days; i++) {
		// Create date for each day counting backwards from today
		const date = new Date();
		date.setDate(today.getDate() - (days - i - 1));

		// Generate a random score between 5 and 100
		const score = Math.floor(Math.random() * 95) + 5;

		// Calculate week number
		const weekNumber = Math.floor(i / 7);

		// Add the day data
		fomoData.push({
			date,
			score,
			weekNumber,
			dayIndex: i % 7
		});
	}

	// Group days into weeks
	const weeks: FomoWeek[] = [];
	const weekGroups = groupBy(fomoData, 'weekNumber');

	Object.entries(weekGroups).forEach(([weekNumberStr, days], index) => {
		const weekNumber = parseInt(weekNumberStr);
		const startDate = new Date(Math.min(...days.map(d => d.date.getTime())));
		const endDate = new Date(Math.max(...days.map(d => d.date.getTime())));

		// Calculate average score for the week
		const avgScore = Math.round(days.reduce((sum, day) => sum + day.score, 0) / days.length);

		weeks.push({
			id: index,
			weekNumber,
			score: avgScore,
			startDate,
			endDate,
			days
		});
	});

	return { days: fomoData, weeks };
}

// Format date as "Mar 2"
export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	});
}

// Get color class based on FOMO score
export function getScoreColorClass(score: number, isSelected: boolean = false): string {
	const baseOpacity = isSelected ? '1' : '0.6';

	if (score >= 80) return `bg-gradient-to-t from-violet-600/${baseOpacity} to-fuchsia-500/${baseOpacity}`;
	if (score >= 60) return `bg-gradient-to-t from-violet-600/${baseOpacity} to-violet-400/${baseOpacity}`;
	if (score >= 40) return `bg-gradient-to-t from-blue-600/${baseOpacity} to-blue-400/${baseOpacity}`;
	if (score >= 20) return `bg-gradient-to-t from-emerald-600/${baseOpacity} to-emerald-400/${baseOpacity}`;
	return `bg-gradient-to-t from-zinc-600/${baseOpacity} to-zinc-400/${baseOpacity}`;
}

// Utility function to group array items by key
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce((result, item) => {
		const groupKey = String(item[key]);

		if (!result[groupKey]) {
			result[groupKey] = [];
		}

		result[groupKey].push(item);
		return result;
	}, {} as Record<string, T[]>);
}