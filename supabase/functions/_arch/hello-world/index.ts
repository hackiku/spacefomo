// src/supabase/functions/hello-world/index.ts

// Simple hello world function
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

	// Get name from query parameter or JSON body
	let name = 'World'

	try {
		if (req.method === 'POST') {
			const body = await req.json()
			if (body.name) {
				name = body.name
			}
		} else {
			const url = new URL(req.url)
			if (url.searchParams.get('name')) {
				name = url.searchParams.get('name') || 'World'
			}
		}
	} catch (error) {
		// If there's an error parsing JSON, just use the default name
		console.error('Error parsing request:', error)
	}

	// Return the response
	return new Response(
		JSON.stringify({
			message: `Hello, ${name}!`,
			timestamp: new Date().toISOString()
		}),
		{
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		}
	)
})

/* To invoke locally:

	1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
	2. Make an HTTP request:
  
	curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/hello-world?name=Claude' \
		--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
	  
	# Or with a POST request:
	curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
		--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
		--header 'Content-Type: application/json' \
		--data '{"name":"SpaceFOMO"}'

*/