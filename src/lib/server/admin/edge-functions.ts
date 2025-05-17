// src/lib/server/admin/edge-functions.ts
import { supabase } from '$lib/server/db/client';

export async function callEdgeFunction(
	functionName: string,
	payload: any = {}
) {
	try {
		const { data, error } = await supabase.functions.invoke(functionName, {
			body: payload
		});

		if (error) throw new Error(`Edge function error: ${error.message}`);
		return { success: true, data };
	} catch (error) {
		console.error(`Error calling ${functionName}:`, error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

// Specific edge function wrappers
export async function processRawNews(id: string, provider: string) {
	return callEdgeFunction('write-news', { raw_news_id: id, provider });
}

export async function startAgentResearch(topic: string, provider: string) {
	return callEdgeFunction('ingest-research', {
		type: 'topic',
		topic,
		provider
	});
}

export async function researchUrl(url: string, provider: string) {
	return callEdgeFunction('ingest-research', {
		type: 'url',
		url,
		provider
	});
}

export async function writeResearchToRawNews(researchId: string) {
	return callEdgeFunction('write-raw-news', {
		source_type: 'agent_research',
		source_id: researchId
	});
}