// src/routes/sitemap.xml/+server.ts
import { fetchNews } from '$lib/services/news/newsService';

export async function GET() {
	const { items } = await fetchNews({ limit: 1000 });

	// src/routes/sitemap.xml/+server.ts
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://spacefomo.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${items.map(item => `
    <url>
      <loc>https://spacefomo.com/news/${item.slug || item.id}</loc>
      <lastmod>${new Date(item.created_at).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}