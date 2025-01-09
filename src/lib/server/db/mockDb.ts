// src/lib/server/db/mockDb.ts
import type { NewsItem } from '$lib/types';

// In-memory store for submitted links
let submittedLinks: string[] = [];

export const mockDb = {
	submitLink: async (url: string) => {
		submittedLinks.push(url);
		return { success: true, url };
	},

	getSubmittedLinks: () => submittedLinks,

	// Add other mock methods as needed
	clearSubmittedLinks: () => {
		submittedLinks = [];
	}
};