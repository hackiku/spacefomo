// src/lib/server/admin/edge-functions.ts
import { supabase } from '$lib/server/db/client';
import { browser } from '$app/environment';
import { useApiConsole } from '$lib/context/apiConsoleContext.svelte';

export async function callEdgeFunction(
	functionName: string,
	payload: any = {}
) {
	// Get API console context if in browser
	let apiConsole;
	if (browser) {
		try {
			apiConsole = useApiConsole();
		} catch (error) {
			// If context not available, just continue without logging
			console.log('API Console context not available, proceeding without logging');
		}
	}

	try {
		// Log request (only in browser with context)
		if (browser) {
			console.log(`Calling ${functionName} with payload:`, payload);
		}

		// Call the edge function
		const { data, error } = await supabase.functions.invoke(functionName, {
			body: payload
		});

		// Process result
		if (error) throw new Error(`Edge function error: ${error.message}`);

		const result = { success: true, data };

		// Log response (only in browser with context)
		if (browser && apiConsole) {
			apiConsole.logApiCall({
				function: functionName,
				timestamp: Date.now(),
				payload,
				response: result,
				success: true
			});
		}

		return result;
	} catch (error) {
		console.error(`Error calling ${functionName}:`, error);

		const errorResult = {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};

		// Log error (only in browser with context)
		if (browser && apiConsole) {
			apiConsole.logApiCall({
				function: functionName,
				timestamp: Date.now(),
				payload,
				response: errorResult,
				success: false
			});
		}

		return errorResult;
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