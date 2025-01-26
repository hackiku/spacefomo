// src/routes/+layout.ts
// Updated layout to handle shared state if needed:
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	// Pass through data from child routes
	return {
		...data
	};
};