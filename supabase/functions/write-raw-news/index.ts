// supabase/functions/write-raw-news/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { extractFromAgentResearch } from './sources/extract-from-agent-research.ts';
import { extractFromSubmission } from './sources/extract-from-submissions.ts';

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
		const requestData = await req.json();

		// Validate request
		if (!requestData.source_type) {
			throw new Error('source_type is required (agent_research, submission)');
		}

		if (!requestData.source_id) {
			throw new Error('source_id is required');
		}

		let result;
		const sourceType = requestData.source_type;
		const sourceId = requestData.source_id;

		// Route to the appropriate extractor
		switch (sourceType) {
			case 'agent_research':
				result = await extractFromAgentResearch(sourceId, supabase);
				break;
			case 'submission':
				result = await extractFromSubmission(sourceId, supabase);
				break;
			default:
				throw new Error(`Unsupported source type: ${sourceType}`);
		}

		// Support batch processing
		if (requestData.batch) {
			if (!Array.isArray(requestData.ids) || requestData.ids.length === 0) {
				throw new Error('Batch processing requires an array of ids');
			}

			const batchResults = [];
			for (const id of requestData.ids) {
				try {
					let batchResult;
					switch (sourceType) {
						case 'agent_research':
							batchResult = await extractFromAgentResearch(id, supabase);
							break;
						case 'submission':
							batchResult = await extractFromSubmission(id, supabase);
							break;
					}
					batchResults.push({ id, success: true, data: batchResult });
				} catch (error) {
					batchResults.push({ id, success: false, error: error.message });
				}
			}

			return new Response(
				JSON.stringify({
					success: true,
					data: batchResults
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				}
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				data: result
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