// src/lib/hooks/useFomo.svelte.ts
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import { getNewsContext } from '$lib/context/newsContext.svelte';

export function useFomo() {
	const fomoContext = getFomoContext();
	const newsContext = getNewsContext();

	// Calculate score value immediately as a number
	let scoreValue = 0;
	try {
		const items = newsContext.newsItems || [];
		if (items.length > 0) {
			const filteredItems = items.filter(item =>
				item.fomo_score && item.fomo_score >= fomoContext.fomoThreshold
			);

			if (filteredItems.length > 0) {
				const totalScore = filteredItems.reduce((sum, item) =>
					sum + (item.fomo_score || 0), 0);
				scoreValue = Math.round(totalScore / filteredItems.length);
			}
		}
	} catch (e) {
		console.error('Error calculating FOMO score:', e);
	}

	// Calculate article count immediately as a number
	let countValue = 0;
	try {
		const items = newsContext.newsItems || [];
		countValue = items.filter(item =>
			item.fomo_score && item.fomo_score >= fomoContext.fomoThreshold
		).length;
	} catch (e) {
		console.error('Error calculating article count:', e);
	}

	console.log('useFomo values:', { scoreValue, countValue, threshold: fomoContext.fomoThreshold });

	return {
		// Pass through the context values
		...fomoContext,
		// Add concrete values (not functions)
		currentScore: scoreValue,
		articleCount: countValue
	};
}