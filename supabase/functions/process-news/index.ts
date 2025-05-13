// supabase/functions/process-news/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { extractArticleData } from './extract.ts'

console.log("Initializing process-news function!")

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

// Generate UUID function
function generateUuid(): string {
	return crypto.randomUUID()
}

// Process a news submission
async function processNewsSubmission(submissionId: number, supabase: any) {
	console.log(`Processing submission ID: ${submissionId}`)

	// 1. Get the submission from the database
	const { data: submission, error: fetchError } = await supabase
		.from('submissions')
		.select('*')
		.eq('id', submissionId)
		.single()

	if (fetchError || !submission) {
		throw new Error(`Error fetching submission: ${fetchError?.message || 'Submission not found'}`)
	}

	// 2. Extract article data using AI
	const articleData = await extractArticleData(submission.url)

	// 3. Prepare data for processed_news table
	const newsEntry = {
		id: generateUuid(),
		submission_id: submission.id,
		title: articleData.title,
		url: submission.url,
		source: articleData.source || new URL(submission.url).hostname.replace('www.', ''),
		read_time: articleData.read_time || Math.ceil((articleData.summary?.length || 0) / 200),
		fomo_score: submission.fomo_score,
		tags: articleData.tags || [],
		week_id: submission.week_id,
		entities: articleData.entities || {},
		context: articleData.context || {},
		impact_score: articleData.impact_score || (articleData.context?.narrative_thread?.importance === 'high' ? 85 : 65),
		publication_date: articleData.publication_date || new Date().toISOString().split('T')[0],
		viral_title: articleData.viral_title || articleData.title,
		slug: articleData.slug || '',
		summary: articleData.summary || '',
		seo: {
			title: null,
			keywords: articleData.tags || [],
			image_url: null,
			description: articleData.summary || '',
			article_type: "NewsArticle",
			canonical_url: `https://spacefomo.com/${articleData.slug || ''}`
		},
		created_at: new Date().toISOString(),
		processed_at: new Date().toISOString()
	}

	// 4. Insert into processed_news table
	console.log('Inserting processed data into processed_news table')
	const { data: news, error: insertError } = await supabase
		.from('processed_news')
		.insert(newsEntry)
		.select()

	if (insertError) {
		throw new Error(`Error inserting news: ${insertError.message}`)
	}

	// 5. Update the submission as processed
	await supabase
		.from('submissions')
		.update({
			published: true,
			processed_at: new Date().toISOString()
		})
		.eq('id', submission.id)

	return news
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
		})
	}

	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
	}

	try {
		const url = new URL(req.url);
		const requestData = await req.json();

		// Test mode - extraction only, no database
		if (url.pathname.endsWith('/test')) {
			if (!requestData.url) {
				throw new Error('url is required for test extraction');
			}

			// Extract data from the URL
			const result = await extractArticleData(
				requestData.url,
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
		// Regular submission processing with database
		else {
			// Get submission ID from request
			const { submissionId } = requestData;

			if (!submissionId) {
				throw new Error('submissionId is required');
			}

			// Create Supabase client
			const supabase = supabaseClient(req);

			// Process the news submission
			const result = await processNewsSubmission(submissionId, supabase);

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
})

/* To invoke locally:

	1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  
	2A. To test extraction without database:
	curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-news/test' \
		--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
		--header 'Content-Type: application/json' \
		--data '{"url": "https://spacenews.com/voyager-technologies-to-acquire-leocloud/"}'
  
	2B. Regular processing with submission from database:
	curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-news' \
		--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
		--header 'Content-Type: application/json' \
		--data '{"submissionId": 1746455073220}'
*/


// { "submissionId": 1747141762655 }