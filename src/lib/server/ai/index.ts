// src/lib/server/ai/index.ts
import { extractEntities } from './tasks/extractEntities';
import { generateSummary } from './tasks/generateSummary';
import { calculateFomo } from './tasks/calculateFomo';
import { enrichContext } from './tasks/enrichContext';
import { supabase } from '$lib/supabaseClient';

export async function processArticle({ url, content, adminProcessed = false }) {
	// 1. Extract entities (OpenAI or Cohere)
	const entities = await extractEntities(content);

	// 2. Generate summary (Claude)
	const summary = await generateSummary(content, entities);

	// 3. Enrich with context (Perplexity)
	const context = await enrichContext(entities);

	// 4. Calculate FOMO score
	const fomoScore = await calculateFomo({ content, entities, context });

	// 5. Prepare the processed article
	const article = {
		url,
		title: entities.title,
		source: entities.source,
		viral_title: summary.viralTitle,
		publication_date: entities.publicationDate,
		read_time: calculateReadTime(content),
		fomo_score: fomoScore,
		tags: entities.tags,
		entities: {
			people: entities.people,
			organizations: entities.organizations,
			facilities: entities.facilities,
			technologies: entities.technologies
		},
		context,
		admin_processed: adminProcessed,
		created_at: new Date().toISOString()
	};

	// 6. Store in database
	const { data, error } = await supabase
		.from('news')
		.insert(article)
		.select()
		.single();

	if (error) throw new Error(`Database error: ${error.message}`);

	return data;
}