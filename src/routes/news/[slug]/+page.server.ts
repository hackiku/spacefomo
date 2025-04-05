// src/routes/news/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/services/supabase/client';

export async function load({ params }) {
	const { slug } = params;

	const { data, error: supabaseError } = await supabase
		.from('news')
		.select('*')
		.eq('slug', slug)
		.single();

	if (supabaseError || !data) {
		throw error(404, {
			message: 'News article not found'
		});
	}

	return {
		article: data
	};
}