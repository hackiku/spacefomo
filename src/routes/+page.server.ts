// src/routes/+page.server.ts
import { supabase } from "$lib/supabaseClient";

export async function load() {
	const { data: week } = await supabase
		.from("weeks")
		.select()
		.eq('week_number', 1)
		.single();

	return {
		week: week ?? null
	};
}