// src/lib/trpc/routes/admin.ts
import { z } from 'zod';
import { t } from '../t';
import { supabase } from '$lib/server/db/client';
import { callEdgeFunction } from '$lib/server/admin/edge-functions';

export const adminRouter = t.router({
	// Get raw news statistics for dashboard
	getRawNewsStats: t.procedure
		.query(async () => {
			try {
				const { data, error } = await supabase
					.from('raw_news')
					.select('status, source_type, count(*)', { count: 'exact' })
					.groupBy('status, source_type');

				if (error) throw error;
				return data || [];
			} catch (error) {
				console.error('Error fetching raw news stats:', error);
				return [];
			}
		}),

	// Get API usage statistics
	getApiUsage: t.procedure
		.query(async () => {
			// This would ideally query a table that logs API usage
			// For now, return mock data
			return {
				providers: [
					{
						name: 'perplexity',
						status: 'operational',
						latency: 254,
						calls: {
							today: 54,
							thisWeek: 286,
							thisMonth: 1243
						},
						costs: {
							today: 2.70,
							thisWeek: 14.30,
							thisMonth: 62.15
						}
					},
					{
						name: 'anthropic',
						status: 'operational',
						latency: 280,
						calls: {
							today: 37,
							thisWeek: 195,
							thisMonth: 842
						},
						costs: {
							today: 4.44,
							thisWeek: 23.40,
							thisMonth: 101.04
						}
					},
					{
						name: 'openai',
						status: 'operational',
						latency: 310,
						calls: {
							today: 28,
							thisWeek: 142,
							thisMonth: 613
						},
						costs: {
							today: 5.04,
							thisWeek: 25.56,
							thisMonth: 110.34
						}
					}
				],
				totalCost: 273.53
			};
		}),

	// Get raw news queue with filtering
	getRawNewsQueue: t.procedure
		.input(z.object({
			status: z.string().optional(),
			sourceType: z.string().optional(),
			limit: z.number().min(1).max(100).optional().default(50),
			offset: z.number().min(0).optional().default(0),
			order: z.enum(['asc', 'desc']).optional().default('desc')
		}))
		.query(async ({ input }) => {
			try {
				let query = supabase
					.from('raw_news')
					.select('*', { count: 'exact' });

				// Apply filters
				if (input.status) {
					query = query.eq('status', input.status);
				}

				if (input.sourceType) {
					query = query.eq('source_type', input.sourceType);
				}

				// Apply ordering and pagination
				query = query
					.order('discovered_at', { ascending: input.order === 'asc' })
					.range(input.offset, input.offset + input.limit - 1);

				const { data, error, count } = await query;

				if (error) throw error;

				return {
					items: data || [],
					meta: {
						totalCount: count || 0,
						offset: input.offset,
						limit: input.limit
					}
				};
			} catch (error) {
				console.error('Error fetching raw news queue:', error);
				return {
					items: [],
					meta: {
						totalCount: 0,
						offset: input.offset,
						limit: input.limit
					}
				};
			}
		}),

	// Process a raw news item
	processRawNewsItem: t.procedure
		.input(z.object({
			id: z.string(),
			provider: z.string().optional().default('perplexity')
		}))
		.mutation(async ({ input }) => {
			try {
				// Update status in database to processing
				await supabase
					.from('raw_news')
					.update({
						status: 'processing',
						process_attempts: supabase.rpc('increment', { row_id: input.id, column_name: 'process_attempts' }),
						last_attempt_at: new Date().toISOString(),
					})
					.eq('id', input.id);

				// Call edge function
				const result = await callEdgeFunction('write-news', {
					raw_news_id: input.id,
					provider: input.provider
				});

				return result;
			} catch (error) {
				console.error('Error processing raw news item:', error);
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error occurred'
				};
			}
		}),

	// Process multiple raw news items
	processBatchRawNews: t.procedure
		.input(z.object({
			ids: z.array(z.string()),
			provider: z.string().optional().default('perplexity')
		}))
		.mutation(async ({ input }) => {
			try {
				// Update status for all items
				await supabase
					.from('raw_news')
					.update({
						status: 'processing',
						process_attempts: supabase.rpc('increment_batch', { row_ids: input.ids, column_name: 'process_attempts' }),
						last_attempt_at: new Date().toISOString(),
					})
					.in('id', input.ids);

				// Call edge function
				const result = await callEdgeFunction('write-news', {
					ids: input.ids,
					provider: input.provider
				});

				return result;
			} catch (error) {
				console.error('Error batch processing raw news:', error);
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error occurred'
				};
			}
		}),

	// Extract content from a raw news article
	extractContent: t.procedure
		.input(z.object({
			id: z.string(),
			provider: z.string().optional().default('perplexity')
		}))
		.mutation(async ({ input }) => {
			try {
				// Call your edge function
				const result = await callEdgeFunction('extract-content', {
					raw_news_id: input.id,
					provider: input.provider
				});

				return result;
			} catch (error) {
				console.error('Error extracting content:', error);
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error occurred'
				};
			}
		}),

	// Process extracted content
	processNewsContent: t.procedure
		.input(z.object({
			id: z.string(),
			provider: z.string().optional().default('anthropic'),
			content: z.any() // Extracted content from previous step
		}))
		.mutation(async ({ input }) => {
			try {
				// Call your edge function
				const result = await callEdgeFunction('process-content', {
					raw_news_id: input.id,
					provider: input.provider,
					content: input.content
				});

				return result;
			} catch (error) {
				console.error('Error processing content:', error);
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error occurred'
				};
			}
		}),

	// Save processed news to database
	saveProcessedNews: t.procedure
		.input(z.object({
			rawNewsId: z.string(),
			processedData: z.any()
		}))
		.mutation(async ({ input, ctx }) => {
			try {
				// Save the processed data
				const { data, error } = await ctx.supabase
					.from('processed_news')
					.insert({
						...input.processedData,
						created_at: new Date().toISOString(),
						processed_at: new Date().toISOString()
					})
					.select('id')
					.single();

				if (error) throw error;

				// Update the raw news record with the processed_news_id
				await ctx.supabase
					.from('raw_news')
					.update({
						status: 'processed',
						processed_news_id: data.id,
						last_attempt_at: new Date().toISOString()
					})
					.eq('id', input.rawNewsId);

				return { success: true, data: { id: data.id } };
			} catch (error) {
				console.error('Error saving processed news:', error);
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error occurred'
				};
			}
		}),

	// Start agent research
	startAgentResearch: t.procedure
		.input(z.object({
			type: z.enum(['url', 'topic', 'submission']),
			url: z.string().optional(),
			topic: z.string().optional(),
			submissionId: z.union([z.string(), z.number()]).optional(),
			timeframe: z.string().optional(),
			provider: z.string().optional().default('perplexity')
		}))
		.mutation(async ({ input }) => {
			try {
				// Call edge function
				const result = await callEdgeFunction('ingest-research', input);
				return result;
			} catch (error) {
				console.error('Error starting research:', error);
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error occurred'
				};
			}
		}),

	// Get recent research
	getRecentResearch: t.procedure
		.input(z.object({
			limit: z.number().min(1).max(50).optional().default(10)
		}))
		.query(async ({ input, ctx }) => {
			try {
				const { data, error } = await ctx.supabase
					.from('agent_research')
					.select('*')
					.order('created_at', { ascending: false })
					.limit(input.limit);

				if (error) throw error;
				return data || [];
			} catch (error) {
				console.error('Error fetching recent research:', error);
				return [];
			}
		}),

	// Get raw news item details
	getRawNewsItem: t.procedure
		.input(z.object({
			id: z.string()
		}))
		.query(async ({ input, ctx }) => {
			try {
				const { data, error } = await ctx.supabase
					.from('raw_news')
					.select('*')
					.eq('id', input.id)
					.single();

				if (error) throw error;
				return data;
			} catch (error) {
				console.error(`Error fetching raw news item ${input.id}:`, error);
				return null;
			}
		}),

	// Update raw news status
	updateRawNewsStatus: t.procedure
		.input(z.object({
			id: z.string(),
			status: z.enum(['pending', 'processing', 'processed', 'error']),
			additionalData: z.record(z.any()).optional()
		}))
		.mutation(async ({ input, ctx }) => {
			try {
				const { error } = await ctx.supabase
					.from('raw_news')
					.update({
						status: input.status,
						last_attempt_at: new Date().toISOString(),
						...(input.additionalData || {})
					})
					.eq('id', input.id);

				if (error) throw error;
				return { success: true };
			} catch (error) {
				console.error(`Error updating raw news status ${input.id}:`, error);
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error occurred'
				};
			}
		})
});