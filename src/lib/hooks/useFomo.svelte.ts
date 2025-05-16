// src/lib/hooks/useFomo.svelte.ts
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import { getNewsContext } from '$lib/context/newsContext.svelte';

export function useFomo() {
	const fomoContext = getFomoContext();
	const newsContext = getNewsContext();

	// Calculate score value reactively
	const currentScore = $derived(() => {
		try {
			const items = newsContext.newsItems || [];
			if (items.length > 0) {
				const filteredItems = items.filter(item =>
					item.fomo_score && item.fomo_score >= fomoContext.fomoThreshold
				);

				if (filteredItems.length > 0) {
					const totalScore = filteredItems.reduce((sum, item) =>
						sum + (item.fomo_score || 0), 0);
					return Math.round(totalScore / filteredItems.length);
				}
			}
			return 0;
		} catch (e) {
			console.error('Error calculating FOMO score:', e);
			return 0;
		}
	});

	// Calculate article count reactively
	const articleCount = $derived(() => {
		try {
			const items = newsContext.newsItems || [];
			return items.filter(item =>
				item.fomo_score && item.fomo_score >= fomoContext.fomoThreshold
			).length;
		} catch (e) {
			console.error('Error calculating article count:', e);
			return 0;
		}
	});

	// Log calculated values on change
	$effect(() => {
		console.log('useFomo values:', {
			currentScore,
			articleCount,
			threshold: fomoContext.fomoThreshold
		});
	});

	return {
		// Pass through the context values
		...fomoContext,
		// Add reactive values
		currentScore,
		articleCount
	};
}