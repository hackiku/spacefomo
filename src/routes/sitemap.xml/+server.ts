// src/routes/sitemap.xml/+server.ts
import { supabase } from '$lib/services/supabase/client';

export async function GET() {
	// Fetch all published news items
	const { data: newsItems } = await supabase
		.from('news')
		.select('id, title, publication_date')
		.order('publication_date', { ascending: false });

	// Generate XML sitemap
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://spacefomo.com/</loc>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        ${newsItems?.map(item => `
        <url>
            <loc>https://spacefomo.com/news/${item.id}</loc>
            <lastmod>${new Date(item.publication_date).toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
        </url>`).join('')}
    </urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}