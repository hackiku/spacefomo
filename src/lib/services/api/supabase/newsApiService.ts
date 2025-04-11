// src/lib/services/api/supabase/newsApiService.ts
import { supabase } from '$lib/services/supabase/client';


export async function fetchNewsFromSupabaseFunction(params = {}) {
	try {
		// Create query string from params
		const queryParams = new URLSearchParams();

		// Add parameters to query string
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null) {
				queryParams.append(key, String(value));
			}
		}

		// Get the Supabase URL from your environment or config
		// Make sure this environment variable is set correctly
		// const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
		const supabaseUrl = "http://127.0.0.1:54321";
		if (!supabaseUrl) {
			throw new Error('PUBLIC_SUPABASE_URL environment variable is not set');
		}

		// Generate the URL for the Edge Function
		const functionUrl = `${supabaseUrl}/functions/v1/get-news?${queryParams.toString()}`;
		console.log('Calling function URL:', functionUrl);

		// Get the current JWT token
		const { data: { session } } = await supabase.auth.getSession();
		const token = session?.access_token || '';

		// Call the Supabase Edge Function
		const response = await fetch(functionUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Error fetching news: ${response.statusText} (${response.status})\n${errorText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Failed to fetch news from Supabase function:', error);
		throw error;
	}
}