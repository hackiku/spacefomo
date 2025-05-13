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

// Add this to research.ts

export async function createCandidateEvent(
	researchId: string,
	supabase: any
): Promise<string> {
	// 1. Fetch research results
	const { data: research, error: researchError } = await supabase
		.from('research')
		.select('*')
		.eq('id', researchId)
		.single();

	if (researchError || !research) {
		throw new Error(`Error fetching research: ${researchError?.message || 'Research not found'}`);
	}

	// 2. Get more details about the original article/submission
	let originalArticle = null;
	let entities = {};
	let context = {};
	let tags = [];
	let fomo_score = 0;

	// Check if we have a submission_id to get more context
	if (research.submission_id) {
		// Try to get processed_news first for rich data
		const { data: processedNews } = await supabase
			.from('processed_news')
			.select('*')
			.eq('submission_id', research.submission_id)
			.single();

		if (processedNews) {
			originalArticle = processedNews;
			entities = processedNews.entities || {};
			context = processedNews.context || {};
			tags = processedNews.tags || [];
			fomo_score = processedNews.fomo_score || 65;
		} else {
			// Fallback to submission data
			const { data: submission } = await supabase
				.from('submissions')
				.select('*')
				.eq('id', research.submission_id)
				.single();

			if (submission) {
				originalArticle = {
					url: submission.url,
					title: research.title || `Submission ${submission.id}`,
					fomo_score: submission.fomo_score || 65
				};
				fomo_score = submission.fomo_score || 65;
			}
		}
	}

	// 3. Generate candidate event data
	// Generate a slug
	const timestamp = new Date().getTime().toString().slice(-4);
	const slug = research.title
		? research.title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.substring(0, 50) + `-${timestamp}`
		: `event-${timestamp}`;

	// Extract entities from sources
	const sourceEntities = {
		companies: new Set(),
		people: new Set(),
		technologies: new Set()
	};


	// Set event date to the most recent date from sources, or today
	const sourceDates = research.results.sources
		.map(s => s.date)
		.filter(d => d && d !== 'Not specified')
		.map(d => new Date(d));

	const event_date = sourceDates.length > 0
		? new Date(Math.max(...sourceDates.map(d => d.getTime()))).toISOString().split('T')[0]
		: new Date().toISOString().split('T')[0];

	// Create the candidate event
	const candidateEvent = {
		id: crypto.randomUUID(),
		research_id: researchId,
		title: research.title || research.results.meta.original_title,
		slug,
		summary: research.results.sources.length > 0
			? research.results.sources[0].summary
			: null,
		fomo_score,
		tags,
		entities,
		context: {
			...context,
			research_meta: research.results.meta,
			event_creation: {
				created_from: 'research',
				created_at: new Date().toISOString(),
				source_count: research.results.sources.length
			}
		},
		event_date,
		status: 'needs_review',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};

	// 4. Insert the candidate event
	const { error: insertError } = await supabase
		.from('candidate_events')
		.insert(candidateEvent);

	if (insertError) {
		throw new Error(`Error creating candidate event: ${insertError.message}`);
	}

	// 5. Add candidate sources
	const candidateSources = [];

	// Add original article as primary source if we have it
	if (originalArticle) {
		candidateSources.push({
			candidate_event_id: candidateEvent.id,
			url: originalArticle.url,
			title: originalArticle.title,
			source: new URL(originalArticle.url).hostname.replace('www.', ''),
			summary: originalArticle.summary || null,
			publication_date: originalArticle.publication_date || null,
			is_primary: true,
			is_processed: !!originalArticle.id,
			processed_news_id: originalArticle.id || null,
			created_at: new Date().toISOString()
		});
	}

	// Add other sources from research
	research.results.sources.forEach(source => {
		candidateSources.push({
			candidate_event_id: candidateEvent.id,
			url: source.url,
			title: source.title,
			source: source.source,
			summary: source.summary,
			publication_date: source.date && source.date !== 'Not specified'
				? new Date(source.date).toISOString().split('T')[0]
				: null,
			is_primary: false,
			is_processed: false,
			created_at: new Date().toISOString()
		});
	});

	if (candidateSources.length > 0) {
		const { error: sourcesError } = await supabase
			.from('candidate_sources')
			.insert(candidateSources);

		if (sourcesError) {
			console.error('Error adding candidate sources:', sourcesError);
			// Continue anyway as we've created the candidate event
		}
	}

	return candidateEvent.id;
}