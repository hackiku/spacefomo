// src/routes/news/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/server/db/client';

export async function load({ params }) {
	const { slug } = params;

	try {
		// Try to find article by slug first
		let { data, error: slugError } = await supabase
			.from('news')
			.select('*')
			.eq('slug', slug)
			.single();

		// If no article found by slug, try by ID as fallback
		if (slugError || !data) {
			// Check if the slug parameter is numeric (could be an ID)
			if (!isNaN(Number(slug))) {
				const { data: idData, error: idError } = await supabase
					.from('news')
					.select('*')
					.eq('id', Number(slug))
					.single();

				if (idError || !idData) {
					throw error(404, {
						message: 'News article not found'
					});
				}

				data = idData;
			} else {
				throw error(404, {
					message: 'News article not found'
				});
			}
		}

		// Check if data exists but doesn't have SEO information
		if (data && (!data.seo || !data.seo.title)) {
			// Create default SEO object if missing
			data.seo = {
				title: data.viral_title || data.title,
				description: data.summary || `Read about ${data.title} on SpaceFomo.`,
				keywords: data.tags || [],
				article_type: "NewsArticle",
				image_url: null,
				canonical_url: `https://spacefomo.com/news/${data.slug || data.id}`
			};
		}

		return {
			article: data
		};
	} catch (err) {
		console.error('Error loading article:', err);
		throw error(404, {
			message: 'News article not found'
		});
	}
}