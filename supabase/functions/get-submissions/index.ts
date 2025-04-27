// src/supabase/functions/get-submissions/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Initializing get-submissions function!")

// Create a Supabase client
const supabaseClient = (req: Request) => {
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
				'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
		const published = params.get('published') === 'true' // Filter by published status
		const weekId = params.get('weekId') ? parseInt(params.get('weekId')) : null

		// Create Supabase client
		const supabase = supabaseClient(req)

		// Build query
		let query = supabase
			.from('submissions')
			.select('*')
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1)

		// Add filters if specified
		if (published !== undefined) {
			query = query.eq('published', published)
		}

		if (weekId) {
			query = query.eq('week_id', weekId)
		}

		// Execute query
		const { data, error } = await query

		if (error) {
			throw error
		}

		return new Response(
			JSON.stringify({
				data,
				meta: {
					limit,
					offset,
					count: data.length
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
		console.error('Error fetching submissions:', error)

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

	curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/get-submissions?limit=5&published=false' \
		--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

*/

