// src/lib/trpc/routers/fomo.ts

import { z } from "zod";
import { t } from "../t";

export const fomoRouter = t.router({
	// Get news filtered by FOMO score
	getFiltered: t.procedure
		.input(z.object({
			threshold: z.number().min(0).max(100).default(50),
			startDate: z.string().optional(),
			endDate: z.string().optional(),
			tags: z.array(z.string()).optional(),
			limit: z.number().min(1).max(100).default(20),
			offset: z.number().min(0).default(0)
		}))
		.query(async ({ input, ctx }) => {
			// Build query with all filters applied at the database level
			let query = ctx.supabase.from('news')
				.select('*', { count: 'exact' })
				.gte('fomo_score', input.threshold);

			// Apply date filters if present
			if (input.startDate && input.endDate) {
				query = query
					.gte('publication_date', input.startDate)
					.lte('publication_date', input.endDate);
			}

			// Apply tag filtering
			if (input.tags && input.tags.length > 0) {
				query = query.contains('tags', input.tags);
			}

			// Apply pagination
			query = query
				.order('publication_date', { ascending: false })
				.range(input.offset, input.offset + input.limit - 1);

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

	// More FOMO-specific endpoints...
});