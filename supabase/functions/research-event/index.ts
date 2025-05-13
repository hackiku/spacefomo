// supabase/functions/research-event/index.ts
// index.ts
import { researchRelatedArticles, storeResearchResults } from './research.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
		const url = new URL(req.url);
		const requestData = await req.json();

		// Test mode - research only, no database writes
		if (url.pathname.endsWith('/test')) {
			// First try simple response for connectivity testing
			if (!requestData.title && !requestData.url && !requestData.submissionId) {
				return new Response(
					JSON.stringify({
						success: true,
						message: "Function is running correctly",
						path: url.pathname
					}),
					{
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*'
						}
					}
				);
			}

			// Perform research without database writes
			const result = await researchRelatedArticles(
				requestData,
				requestData.apiKey // Optional API key override
			);

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
		}
		// Research only endpoint - store research but don't create event
		else if (url.pathname.endsWith('/research')) {
			// We need at least a submission ID or URL
			if (!requestData.submissionId && !requestData.url) {
				throw new Error('Either submissionId or url is required');
			}

			// Create Supabase client
			const supabase = supabaseClient(req);

			// Perform research
			const result = await researchRelatedArticles(requestData);

			// Store results if we have a submission ID
			let researchId;
			if (requestData.submissionId) {
				researchId = await storeResearchResults(
					requestData.submissionId,
					result,
					supabase
				);
			}

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
		}
		// Full production endpoint with event creation
		else {
			// This would include the code for creating events
			// For now, just indicate this isn't implemented yet
			return new Response(
				JSON.stringify({
					success: false,
					error: "Event creation not yet implemented"
				}),
				{
					status: 501, // Not Implemented
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				}
			);
		}
	} catch (error) {
		console.error('Error processing request:', error);

		return new Response(
			JSON.stringify({
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