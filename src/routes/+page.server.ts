// src/routes/+page.server.ts
import { supabase } from "$lib/supabaseClient";

export async function load() {
	try {
		const { data: week, error } = await supabase
			.from("weeks")
			.select()
			.eq('week_number', 1)
			.single();

		if (error) {
			console.error('Error fetching week:', error);
			return { week: null };
		}

		return { week };
	} catch (error) {
		console.error('Error:', error);
		return { week: null };
	}
}