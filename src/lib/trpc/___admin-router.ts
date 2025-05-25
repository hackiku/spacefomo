// src/lib/trpc/admin-router.ts
import { t } from './t';
import { rawNewsRouter } from '$lib/server/admin/rawNewsService';
import { apiMonitorRouter } from './routes/admin/api-monitor';
import { agentResearchRouter } from './routes/admin/agent-research';

// Admin-specific procedures that create a security boundary
export const adminRouter = t.router({
	rawNews: rawNewsRouter,
	apiMonitor: apiMonitorRouter,
	agentResearch: agentResearchRouter,

	// Admin dashboard stats
	getRawNewsStats: t.procedure
		.query(async ({ ctx }) => {
			// Verify admin permissions again as a safeguard
			if (!ctx.isAdmin) throw new Error('Unauthorized');

			// Fetch stats from database
			const { data, error } = await ctx.supabase
				.from('raw_news')
				.select('status, source_type, count(*)', { count: 'exact' })
				.groupBy('status, source_type');

			if (error) throw new Error(`Database error: ${error.message}`);
			return data || [];
		}),

	// More admin-specific procedures...
});

// Create a type-safe caller function for server-side usage
export const createAdminCaller = t.createCallerFactory(adminRouter);