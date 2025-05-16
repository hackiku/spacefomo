// src/lib/trpc/router.ts
import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { supabase } from '$lib/server/db/client';

// Initialize tRPC
export const t = initTRPC.context<Context>().create();

export const router = t.router({
	getNews: t.procedure
		.input(z.object({
			minScore: z.number().min(0).max(100).optional().default(0),
			offset: z.number().min(0).optional().default(0),
			limit: z.number().min(1).max(100).optional().default(20),
		}))
		.query(async ({ input, ctx }) => {
			// Use Supabase client from context
			const { data, error, count } = await ctx.supabase
				.from('news')
				.select('*', { count: 'exact' })
				.gte('fomo_score', input.minScore)
				.range(input.offset, input.offset + input.limit - 1);

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
});

// Create a type-safe caller function for server-side usage
export const createCaller = t.createCallerFactory(router);

// Export the router type for client-side usage
export type Router = typeof router;