// src/lib/features/fomo/timeline/data.ts

// Generate fake FOMO data for the timeline
export function generateFomoData() {
	const days = [];
	const totalDays = 180; // About 6 months of data

	// Generate a base date (today) and work backwards
	const today = new Date();

	for (let i = 0; i < totalDays; i++) {
		// Create date for each day counting backwards from today
		const date = new Date();
		date.setDate(today.getDate() - (totalDays - i - 1));

		// Generate a random score between 5 and 100
		const score = Math.floor(Math.random() * 95) + 5;

		// Calculate week number
		const weekNumber = Math.floor(i / 7);

		// Add the day data
		days.push({
			date,
			score,
			weekNumber,
			dayIndex: i % 7
		});
	}

	// Group days into weeks
	const weeks = [];
	for (let i = 0; i < Math.ceil(totalDays / 7); i++) {
		weeks.push(days.slice(i * 7, (i + 1) * 7));
	}

	return { days, weeks };
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