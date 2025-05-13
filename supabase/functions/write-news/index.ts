// supabase/functions/write-news/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getProvider } from './providers/index.ts';
import { slugify } from './utils/slug-generator.ts';

// Constants
const MAX_RETRIES = 2;
const MAX_BATCH_SIZE = 5;

// Create a Supabase client
const createSupabaseClient = (req: Request) => {
	const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
	const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

	const authHeader = req.headers.get('Authorization');

	if (authHeader) {
		// Use the client's JWT if provided
		const token = authHeader.replace('Bearer ', '');
		return createClient(supabaseUrl, supabaseKey, {
			global: { headers: { Authorization: `Bearer ${token}` } },
		});
	}

	// Otherwise use the anon key
	return createClient(supabaseUrl, supabaseKey);
};

/**
 * Process a single raw news item
 */
async function processRawNews(rawNewsId: string, providerName: string, supabase: any) {
	console.log(`[${rawNewsId}] Starting processing with provider: ${providerName}`);

	// Get the raw news item
	const { data: rawNews, error: fetchError } = await supabase
		.from('raw_news')
		.select('*')
		.eq('id', rawNewsId)
		.single();

	if (fetchError || !rawNews) {
		throw new Error(`Error fetching raw news: ${fetchError?.message || 'Raw news not found'}`);
	}

	// Mark as processing
	await supabase
		.from('raw_news')
		.update({
			status: 'processing',
			process_attempts: (rawNews.process_attempts || 0) + 1,
			last_attempt_at: new Date().toISOString()
		})
		.eq('id', rawNewsId);

	try {
		// Get the appropriate provider
		const provider = await getProvider(providerName);

		// Process the URL
		const extractedData = await provider.processUrl(
			rawNews.url,
			{
				title: rawNews.title,
				source: rawNews.source_name,
				publicationDate: rawNews.publication_date,
				context: rawNews.context
			}
		);

		// Generate a slug
		let slug = extractedData.slug;
		if (!slug) {
			const titleForSlug = extractedData.viral_title || extractedData.title;
			slug = slugify(titleForSlug);
		}

		// Ensure slug is unique by adding a timestamp if needed
		const { data: existingSlug } = await supabase
			.from('processed_news')
			.select('id')
			.eq('slug', slug)
			.maybeSingle();

		if (existingSlug) {
			const timestamp = new Date().getTime().toString().slice(-4);
			slug = `${slug}-${timestamp}`;
		}

		// Prepare data for processed_news
		const newsEntry = {
			title: extractedData.title,
			url: rawNews.url,
			source: extractedData.source || rawNews.source_name,
			read_time: extractedData.read_time || 3,
			fomo_score: rawNews.source_fomo || extractedData.fomo_score || 70,
			tags: extractedData.tags || [],
			week_id: rawNews.context?.week_id || null,
			entities: extractedData.entities || {},
			context: {
				...rawNews.context,
				...extractedData.context
			},
			impact_score: extractedData.impact_score || 60,
			publication_date: extractedData.publication_date || rawNews.publication_date || new Date().toISOString().split('T')[0],
			viral_title: extractedData.viral_title || null,
			slug: slug,
			summary: extractedData.summary || null,
			seo: {
				title: extractedData.title,
				keywords: extractedData.tags || [],
				image_url: null,
				description: extractedData.summary || '',
				article_type: "NewsArticle",
				canonical_url: `https://spacefomo.com/news/${slug}`
			},
			processed_at: new Date().toISOString()
		};

		// Insert into processed_news
		const { data: processedNews, error: insertError } = await supabase
			.from('processed_news')
			.insert(newsEntry)
			.select()
			.single();

		if (insertError) {
			throw new Error(`Error inserting processed news: ${insertError.message}`);
		}

		// Update raw_news status
		await supabase
			.from('raw_news')
			.update({
				status: 'processed',
				processed_news_id: processedNews.id,
				plaintext: extractedData.plaintext || null,
				last_attempt_at: new Date().toISOString()
			})
			.eq('id', rawNewsId);

		console.log(`[${rawNewsId}] Successfully processed into ${processedNews.id}`);

		return {
			success: true,
			raw_news_id: rawNewsId,
			processed_news_id: processedNews.id,
			slug: processedNews.slug
		};
	} catch (error) {
		console.error(`[${rawNewsId}] Processing error:`, error);

		// Update with error status
		await supabase
			.from('raw_news')
			.update({
				status: 'error',
				error: error.message,
				last_attempt_at: new Date().toISOString()
			})
			.eq('id', rawNewsId);

		return {
			success: false,
			raw_news_id: rawNewsId,
			error: error.message
		};
	}
}

/**
 * Process multiple raw news items
 */
async function processBatch(rawNewsIds: string[], providerName: string, supabase: any) {
	const results = [];

	// Process in smaller chunks to avoid overloading
	for (let i = 0; i < rawNewsIds.length; i += MAX_BATCH_SIZE) {
		const chunk = rawNewsIds.slice(i, i + MAX_BATCH_SIZE);
		const chunkPromises = chunk.map(id => processWithRetry(id, providerName, supabase));
		const chunkResults = await Promise.all(chunkPromises);
		results.push(...chunkResults);
	}

	return results;
}

/**
 * Process with retry logic
 */
async function processWithRetry(rawNewsId: string, providerName: string, supabase: any) {
	let lastError;

	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		try {
			return await processRawNews(rawNewsId, providerName, supabase);
		} catch (error) {
			console.error(`Retry ${attempt + 1}/${MAX_RETRIES} failed:`, error);
			lastError = error;

			// Exponential backoff
			const backoffMs = Math.pow(2, attempt) * 1000;
			await new Promise(r => setTimeout(r, backoffMs));
		}
	}

	// All retries failed
	return {
		success: false,
		raw_news_id: rawNewsId,
		error: lastError?.message || 'Maximum retries exceeded'
	};
}

Deno.serve(async (req) => {
	// Handle CORS preflight request
	if (req.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			}
		});
	}

	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}

	try {
		const supabase = createSupabaseClient(req);
		const requestData = await req.json();

		// Validate request
		if (!requestData.raw_news_id && !requestData.ids) {
			throw new Error('raw_news_id or ids array is required');
		}

		// Set provider (default to perplexity)
		const provider = requestData.provider || 'perplexity';

		// Handle batch processing
		if (requestData.ids && Array.isArray(requestData.ids)) {
			const results = await processBatch(requestData.ids, provider, supabase);

			return new Response(
				JSON.stringify({
					success: true,
					results
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				}
			);
		}

		// Handle single item processing
		const result = await processWithRetry(requestData.raw_news_id, provider, supabase);

		return new Response(
			JSON.stringify({
				success: result.success,
				...result
			}),
			{
				status: result.success ? 200 : 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			}
		);
	} catch (error) {
		console.error('Error processing request:', error);

		return new Response(
			JSON.stringify({
				success: false,
				error: error.message || 'An unexpected error occurred'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			}
		);
	}
});