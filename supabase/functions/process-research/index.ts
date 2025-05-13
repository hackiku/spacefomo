// process-research/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
// Process a research result
async function processResearchSource(researchId: string, sourceIndex: number, supabase: any) {
	// 1. Get the research result
	const { data: research, error: fetchError } = await supabase
		.from('research')
		.select('*')
		.eq('id', researchId)
		.single();

	if (fetchError || !research) {
		throw new Error(`Error fetching research: ${fetchError?.message || 'Research not found'}`);
	}

	// 2. Extract the specific source
	const sources = research.results.sources;
	if (!sources || sources.length <= sourceIndex) {
		throw new Error(`Source index ${sourceIndex} not found in research results`);
	}

	const source = sources[sourceIndex];

	// 3. Check if this URL already exists in processed_news
	const { data: existing } = await supabase
		.from('processed_news')
		.select('id')
		.eq('url', source.url)
		.limit(1);

	if (existing && existing.length > 0) {
		console.log(`URL already exists in processed_news: ${source.url}`);
		return existing[0].id;
	}

	// 4. Get or create the news outlet
	let outletId = null;
	const outletName = source.source;
	const outletDomain = new URL(source.url).hostname.replace('www.', '');

	const { data: outlet } = await supabase
		.from('news_outlets')
		.select('id')
		.eq('name', outletName)
		.limit(1);

	if (outlet && outlet.length > 0) {
		outletId = outlet[0].id;
	} else {
		// Create new outlet
		const { data: newOutlet, error: outletError } = await supabase
			.from('news_outlets')
			.insert({
				name: outletName,
				domain: outletDomain
			})
			.select('id');

		if (outletError) {
			console.warn(`Error creating outlet: ${outletError.message}`);
		} else {
			outletId = newOutlet[0].id;
		}
	}

	// 5. Create processed_news entry
	const newsId = crypto.randomUUID();
	const newsEntry = {
		id: newsId,
		title: source.title,
		url: source.url,
		source: source.source,
		outlet_id: outletId,
		read_time: Math.ceil((source.summary?.length || 0) / 200),
		fomo_score: 65, // Default score for research-discovered items
		tags: [],
		entities: {},
		context: {
			discovered_via: 'research',
			research_id: research.id,
			original_summary: source.summary
		},
		impact_score: 70,
		publication_date: source.date && source.date !== 'Not specified'
			? new Date(source.date).toISOString().split('T')[0]
			: new Date().toISOString().split('T')[0],
		viral_title: source.title,
		slug: generateSlug(source.title),
		summary: source.summary,
		created_at: new Date().toISOString(),
		processed_at: new Date().toISOString()
	};

	// 6. Insert into processed_news
	const { error: insertError } = await supabase
		.from('processed_news')
		.insert(newsEntry);

	if (insertError) {
		throw new Error(`Error inserting news: ${insertError.message}`);
	}

	return newsId;
}

// Generate a slug from a title
function generateSlug(title: string): string {
	const timestamp = new Date().getTime().toString().slice(-4);
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.substring(0, 50) + `-${timestamp}`;
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
		const requestData = await req.json();

		// We need researchId and sourceIndex
		if (!requestData.researchId) {
			throw new Error('researchId is required');
		}

		// Create Supabase client
		const supabase = supabaseClient(req);

		// Process all sources or just one?
		if (requestData.processAll) {
			// 1. Get the research result
			const { data: research, error: fetchError } = await supabase
				.from('research')
				.select('*')
				.eq('id', requestData.researchId)
				.single();

			if (fetchError || !research) {
				throw new Error(`Error fetching research: ${fetchError?.message || 'Research not found'}`);
			}

			const sources = research.results.sources;
			const results = [];

			// Process each source
			for (let i = 0; i < sources.length; i++) {
				try {
					const newsId = await processResearchSource(requestData.researchId, i, supabase);
					results.push({ sourceIndex: i, newsId, success: true });
				} catch (error) {
					results.push({ sourceIndex: i, error: error.message, success: false });
				}
			}

			return new Response(
				JSON.stringify({
					success: true,
					data: results
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				}
			);
		} else {
			// Process a single source
			if (typeof requestData.sourceIndex !== 'number') {
				throw new Error('sourceIndex is required when not processing all sources');
			}

			const newsId = await processResearchSource(
				requestData.researchId,
				requestData.sourceIndex,
				supabase
			);

			return new Response(
				JSON.stringify({
					success: true,
					data: { newsId }
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
});