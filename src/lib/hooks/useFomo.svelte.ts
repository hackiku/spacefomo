// src/lib/hooks/useFomo.svelte.ts
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import { getNewsContext } from '$lib/context/newsContext.svelte';

export function useFomo() {
	const fomoContext = getFomoContext();
	const newsContext = getNewsContext();

	// Calculate the current FOMO score from filtered items
	const currentScore = $derived(() => {
		const items = newsContext.currentItems;
		if (!items || items.length === 0) return 0;

		// Only count items that meet the threshold
		const filteredItems = items.filter(item =>
			item.fomo_score && item.fomo_score >= fomoContext.fomoThreshold
		);

		if (filteredItems.length === 0) return 0;

		const totalScore = filteredItems.reduce((sum, item) =>
			sum + (item.fomo_score || 0), 0);

		return Math.round(totalScore / filteredItems.length);
	});

	// Calculate the number of articles that meet the filter criteria
	const articleCount = $derived(() => {
		return newsContext.currentItems.filter(item =>
			item.fomo_score && item.fomo_score >= fomoContext.fomoThreshold
		).length;
	});

	return {
		// Pass through the context values
		...fomoContext,
		// Add derived values
		currentScore,
		articleCount
	};
}