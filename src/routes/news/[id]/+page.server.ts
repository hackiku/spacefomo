// src/routes/news/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/services/supabase/client';

export async function load({ params }) {
	const { id } = params;

	const { data, error: supabaseError } = await supabase
		.from('news')
		.select('*')
		.eq('id', id)
		.single();

	if (supabaseError || !data) {
		throw error(404, {
			message: 'News item not found'
		});
	}

	return {
		newsItem: data
	};
}