// supabase/functions/research-event/research.ts

import { PerplexityClient } from './api-clients/perplexity.ts';
import { ResearchRequest, ResearchResult } from './models/research.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Research function that doesn't write to database
export async function researchRelatedArticles(
	request: ResearchRequest,
	apiKey?: string
): Promise<ResearchResult> {
	// Initialize Perplexity client
	const perplexity = new PerplexityClient({ apiKey });

	// If we have a title and URL, use them directly
	if (request.url && request.title) {
		return await perplexity.researchRelatedNews(
			request.title,
			request.url,
			request.entities || {}
		);
	}

	// Otherwise, we need to fetch info from the submission
	if (!request.submissionId) {
		throw new Error('Either submissionId or url+title is required');
	}

	// Get Supabase client (you'd need to implement this)
	const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
	const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
	const supabase = createClient(supabaseUrl, supabaseKey);

	// Fetch the submission
	const { data: submission, error } = await supabase
		.from('submissions')
		.select('*')
		.eq('id', request.submissionId)
		.single();

	if (error || !submission) {
		throw new Error(`Error fetching submission: ${error?.message || 'Submission not found'}`);
	}

	// Now we have a URL, but we need a title
	// You could either fetch the processed_news if it exists,
	// or just use the URL as a fallback

	// Check if we already have processed news for this submission
	const { data: processedNews } = await supabase
		.from('processed_news')
		.select('title, entities')
		.eq('submission_id', submission.id)
		.single();

	if (processedNews) {
		// If we already have processed news, use that info
		return await perplexity.researchRelatedNews(
			processedNews.title,
			submission.url,
			processedNews.entities || {}
		);
	}

	// Otherwise just use the URL
	// In a more complete solution, you could fetch the page title
	return await perplexity.researchRelatedNews(
		`News from ${new URL(submission.url).hostname}`,
		submission.url,
		{}
	);
}

// Function to store research results
export async function storeResearchResults(
	submissionId: number | string,
	results: ResearchResult,
	supabase: any
): Promise<string> {
	const researchId = crypto.randomUUID();

	// Store the research results
	const { error } = await supabase
		.from('research')
		.insert({
			id: researchId,
			submission_id: submissionId,
			url: results.meta.original_url,
			title: results.meta.original_title,
			query: results.meta.query,
			results: results,
			status: 'completed',
			created_at: new Date().toISOString(),
			completed_at: new Date().toISOString()
		});

	if (error) {
		throw new Error(`Error storing research: ${error.message}`);
	}

	return researchId;
}