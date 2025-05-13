
// supabase/functions/ingest-research/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { performResearch } from './api-clients/index.ts';
import { ResearchRequest, ResearchResult } from './models/research.ts';

// Create a Supabase client
const supabaseClient = (req: Request) => {
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

async function handleSubmissionResearch(submissionId: string | number, supabase: any): Promise<ResearchResult> {
	// Get the submission
	const { data: submission, error } = await supabase
		.from('submissions')
		.select('*')
		.eq('id', submissionId)
		.single();

	if (error || !submission) {
		throw new Error(`Error fetching submission: ${error?.message || 'Submission not found'}`);
	}

	// Check if we already have processed_news for this submission to get a title
	const { data: processedNews } = await supabase
		.from('processed_news')
		.select('title')
		.eq('submission_id', submissionId)
		.single();

	const title = processedNews?.title || `Submission ${submissionId}`;

	// Create a URL-based research request
	const request: ResearchRequest = {
		type: 'url',
		url: submission.url,
		topic: title // Using topic field to pass title
	};

	return await performResearch(request);
}

async function storeResearchResult(
	request: ResearchRequest,
	result: ResearchResult,
	supabase: any
): Promise<string> {
	const researchId = crypto.randomUUID();

	const researchEntry = {
		id: researchId,
		research_type: request.type,
		submission_id: request.type === 'submission' ? request.submissionId : null,
		url: request.type === 'url' ? request.url : null,
		topic: request.topic || null,
		timeframe: request.timeframe || null,
		query: result.meta.query,
		provider: request.provider || 'perplexity',
		results: result,
		status: 'completed',
		created_at: new Date().toISOString(),
		completed_at: new Date().toISOString()
	};

	const { error } = await supabase
		.from('agent_research') // Using the new table name
		.insert(researchEntry);

	if (error) {
		throw new Error(`Error storing research: ${error.message}`);
	}

	return researchId;
}

// Handle requests
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
		const supabase = supabaseClient(req);
		const requestData = await req.json() as ResearchRequest;

		// Validate request
		if (!requestData.type) {
			throw new Error('Research type is required (url, submission, or topic)');
		}

		let result: ResearchResult;

		// Handle different research types
		if (requestData.type === 'submission') {
			if (!requestData.submissionId) {
				throw new Error('submissionId is required for submission-based research');
			}
			result = await handleSubmissionResearch(requestData.submissionId, supabase);
		}
		else {
			// Handle URL and topic types directly
			result = await performResearch(requestData);
		}

		// Store result in database
		const researchId = await storeResearchResult(requestData, result, supabase);

		return new Response(
			JSON.stringify({
				success: true,
				data: result,
				researchId
			}),
			{
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


