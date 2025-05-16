// src/routes/sitemap.xml/+server.ts
// import { fetchNews } from '$lib/services/news/newsService';
import { supabase } from '$lib/server/db/client';

export async function GET() {
	// Get all published news items
	const { data: items, error } = await supabase
		.from('news')
		.select('id, slug, created_at, publication_date, viral_title')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching articles for sitemap:', error);
		return new Response('Error generating sitemap', { status: 500 });
	}

	// XML header with correct namespaces
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://spacefomo.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://spacefomo.com/news</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${items.map(item => `
  <url>
    <loc>https://spacefomo.com/news/${item.slug || item.id}</loc>
    <lastmod>${new Date(item.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>SpaceFomo</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(item.publication_date || item.created_at).toISOString()}</news:publication_date>
      <news:title>${encodeXML(item.viral_title)}</news:title>
    </news:news>
  </url>
  `).join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}

// Helper function to safely encode XML
function encodeXML(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}