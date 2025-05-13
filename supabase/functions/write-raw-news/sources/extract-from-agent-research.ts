// supabase/functions/write-raw-news/sources/extract-from-agent-research.ts

export async function extractFromAgentResearch(researchId: string, supabase: any) {
	// Get the research result
	const { data: research } = await supabase
		.from('agent_research')
		.select('*')
		.eq('id', researchId)
		.single();

	if (!research || !research.results || !research.results.sources) {
		throw new Error('Invalid research data');
	}

	// Extract each source as a raw_news item
	const rawNewsItems = [];
	const processedUrls = new Set(); // Track URLs we've already processed

	for (const source of research.results.sources) {
		try {
			// Apply fallback extraction if needed
			const url = extractUrl(source);

			// Skip if we've already processed this URL in this batch
			if (processedUrls.has(url)) {
				continue;
			}
			processedUrls.add(url);

			// Check if URL already exists in raw_news
			const { data: existing } = await supabase
				.from('raw_news')
				.select('id')
				.eq('url', url)
				.limit(1);

			if (existing && existing.length > 0) {
				rawNewsItems.push({
					id: existing[0].id,
					url,
					alreadyExists: true
				});
				continue;
			}

			const title = extractTitle(source);
			const sourceName = extractSourceName(source);
			const date = extractDate(source);

			// Create raw_news entry
			const { data, error } = await supabase
				.from('raw_news')
				.insert({
					url,
					title,
					publication_date: date ? new Date(date) : null,
					source_name: sourceName,
					source_type: 'agent_research',
					source_id: research.id,
					discovered_at: new Date().toISOString(),
					source_fomo: null, // No FOMO score for research-discovered content
					context: {
						research_type: research.research_type,
						original_query: research.query,
						source_index: research.results.sources.indexOf(source),
						summary: source.summary,
						// Store relationship info
						related_sources: research.results.sources
							.filter(s => extractUrl(s) !== url)
							.map(s => extractUrl(s))
					}
				})
				.select();

			if (error) throw error;
			rawNewsItems.push({
				...data[0],
				alreadyExists: false
			});
		} catch (error) {
			console.error(`Error extracting source: ${error.message}`);
			// Continue with next source
		}
	}

	return rawNewsItems;
}

// Fallback extraction functions
function extractUrl(source: any): string {
	if (typeof source === 'string') return source;
	if (source.url) return source.url;
	if (source.link) return source.link;
	if (source.href) return source.href;
	throw new Error('Could not extract URL');
}

function extractTitle(source: any): string {
	if (source.title) return source.title;
	if (source.headline) return source.headline;
	if (source.name) return source.name;
	return 'Untitled';
}

function extractDate(source: any): string | null {
	if (!source) return null;

	// Try direct date properties
	const dateProps = ['date', 'publication_date', 'published_at', 'publishedAt', 'pubDate'];
	for (const prop of dateProps) {
		if (source[prop] && source[prop] !== 'Not specified') {
			try {
				// Check if it's a valid date
				const date = new Date(source[prop]);
				if (!isNaN(date.getTime())) {
					return date.toISOString().split('T')[0];
				}
			} catch {
				// Continue to next property
			}
		}
	}

	return null;
}

function extractSourceName(source: any): string {
	if (!source) return 'Unknown';

	// Try different property names
	const sourceProps = ['source', 'publication', 'outlet', 'site', 'publisher'];
	for (const prop of sourceProps) {
		// Handle if property exists and is string
		if (typeof source[prop] === 'string' && source[prop].trim()) {
			return source[prop].trim();
		}

		// Handle if property is an object with a name
		if (typeof source[prop] === 'object' && source[prop]?.name) {
			return source[prop].name.trim();
		}
	}

	// If we can't find a source name, try to extract from URL
	if (source.url) {
		try {
			return new URL(source.url).hostname.replace('www.', '');
		} catch {
			// URL parsing failed
		}
	}

	return 'Unknown';
}