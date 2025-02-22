// src/routes/+page.server.ts
import { supabase } from "$lib/supabaseClient";

export async function load() {
	try {
		// First, let's check if we can connect by getting a count
		const { count, error: countError } = await supabase
			.from("weeks")
			.select('*', { count: 'exact' });

		if (countError) {
			console.error('Count error:', countError);
			return {
				week: null,
				debug: { error: 'Count failed', details: countError.message }
			};
		}

		console.log(`Found ${count} weeks in database`);

		// Now try to get the most recent week
		const { data: week, error } = await supabase
			.from("weeks")
			.select()
			.order('week_number', { ascending: false })
			.limit(1)
			.single();

		if (error) {
			console.error('Week fetch error:', error);
			return {
				week: null,
				debug: { error: 'Fetch failed', details: error.message }
			};
		}

		return {
			week,
			debug: { success: true, weekCount: count }
		};
	} catch (error) {
		console.error('Unexpected error:', error);
		return {
			week: null,
			debug: { error: 'Unexpected error', details: String(error) }
		};
	}
}