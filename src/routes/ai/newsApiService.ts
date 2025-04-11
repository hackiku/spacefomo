// Example: src/lib/services/api/newsApiService.ts
import { supabase } from '$lib/services/supabase/client';

export async function fetchNewsFromSupabaseFunction(params = {}) {
	// Create query string from params
	const queryParams = new URLSearchParams();

	// Add parameters to query string
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null) {
			queryParams.append(key, String(value));
		}
	}

	// Get the Supabase URL from your environment or config
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

	// Generate the URL for the Edge Function
	const functionUrl = `${supabaseUrl}/functions/v1/get-news?${queryParams.toString()}`;

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
		throw new Error(`Error fetching news: ${response.statusText}`);
	}

	return await response.json();
}