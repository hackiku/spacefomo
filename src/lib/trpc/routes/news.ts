// src/lib/trpc/routes/news.ts

import { z } from 'zod';
import { t } from '../t';

export const newsRouter = t.router({
	getNews: t.procedure
		.input(z.object({
			minScore: z.number().min(0).max(100).optional().default(0),
			offset: z.number().min(0).optional().default(0),
			limit: z.number().min(1).max(100).optional().default(20),
			processed: z.boolean().optional().default(false),
			tags: z.array(z.string()).optional(),
			dateStart: z.string().optional(),
			dateEnd: z.string().optional(),
		}))
		.query(async ({ input, ctx }) => {
			// The query logic you currently have in router.ts
			let query = ctx.supabase
				.from(input.processed ? 'processed_news' : 'news')
				.select('*', { count: 'exact' });

			// Apply score filter
			if (input.minScore) {
				query = query.gte('fomo_score', input.minScore);
			}

			// Apply date filters
			if (input.dateStart && input.dateEnd) {
				query = query
					.gte('publication_date', input.dateStart)
					.lte('publication_date', input.dateEnd);
			}

			// Apply tag filter
			if (input.tags && input.tags.length > 0) {
				// This is a simplified version - you may need to adjust based on how tags are stored
				query = query.contains('tags', input.tags);
			}

			// Apply pagination
			query = query.range(
				input.offset,
				input.offset + input.limit - 1
			);

			const { data, error, count } = await query;
			if (error) throw new Error(`Database error: ${error.message}`);

			return {
				items: data || [],
				meta: {
					totalCount: count || 0,
					offset: input.offset,
					limit: input.limit,
					page: Math.floor(input.offset / input.limit) + 1,
					totalPages: Math.ceil((count || 0) / input.limit),
				}
			};
		}),

	// Add other news-related procedures here
	getNewsById: t.procedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			// Implementation
		}),
});