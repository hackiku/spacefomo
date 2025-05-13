// src/supabase/functions/get-news/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Initializing get-news function!")

// Create a single Supabase client for interacting with your database
const supabaseClient = (req: Request) => {
	// Note: SUPABASE_URL and SUPABASE_ANON_KEY are automatically injected by Supabase
	const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
	const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

	const authHeader = req.headers.get('Authorization')

	if (authHeader) {
		// Use the client's JWT if provided
		const token = authHeader.replace('Bearer ', '')
		return createClient(supabaseUrl, supabaseKey, {
			global: { headers: { Authorization: `Bearer ${token}` } },
		})
	}

	// Otherwise use the anon key
	return createClient(supabaseUrl, supabaseKey)
}

// Handle requests
Deno.serve(async (req) => {
	// Handle CORS preflight request
	if (req.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			}
		})
	}

	try {
		const url = new URL(req.url)
		const params = new URLSearchParams(url.search)

		// Get query parameters with defaults
		const limit = parseInt(params.get('limit') || '10')
		const offset = parseInt(params.get('offset') || '0')
		const minScore = parseInt(params.get('minScore') || '0')
		const weekId = params.get('weekId') ? parseInt(params.get('weekId')) : null
		const sortBy = params.get('sortBy') || 'fomo_score'
		const sortDir = (params.get('sortDir') || 'desc') as 'asc' | 'desc'

		// Parse tags if provided
		let tags: string[] = []
		if (params.get('tags')) {
			tags = params.get('tags')!.split(',')
		}

		// Create Supabase client
		const supabase = supabaseClient(req)

		// Build query
		let query = supabase
			.from('news')
			.select('*, seo')
			.order(sortBy, { ascending: sortDir === 'asc' })
			.gte('fomo_score', minScore)
			.range(offset, offset + limit - 1)

		// Add week filter if specified
		if (weekId) {
			query = query.eq('week_id', weekId)
		}

		// Add tags filter if specified
		if (tags.length > 0) {
			// This assumes tags are stored as a JSON array
			// Adjust if your tags structure is different
			query = query.contains('tags', tags)
		}

		// Execute query
		const { data, error, count } = await query

		if (error) {
			throw error
		}

		return new Response(
			JSON.stringify({
				data,
				meta: {
					limit,
					offset,
					count
				}
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			}
		)
	} catch (error) {
		console.error('Error fetching news:', error)

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
		)
	}
})

/* To invoke locally:

	1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
	2. Make an HTTP request:

	curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/get-news?limit=5&sortBy=fomo_score&sortDir=desc' \
		--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

*/