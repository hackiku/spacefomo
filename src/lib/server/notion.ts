// src/lib/server/notion.ts
import { NOTION_API_KEY, NOTION_DATABASE_ID } from '$env/static/private';
import { createClient } from '@notionhq/client';
import { dev } from '$app/environment';
import type { NewsItem } from '$lib/types';

const notion = createClient({ auth: NOTION_API_KEY });

// Cache news items with a TTL
let newsCache: NewsItem[] = [];
let lastFetch = 0;
const CACHE_TTL = dev ? 1000 * 60 : 1000 * 60 * 15; // 1 min dev, 15 min prod

// Map Notion properties to our NewsItem type
function mapNotionToNews(page: any): NewsItem {
	const props = page.properties;

	return {
		id: page.id,
		title: props.Headline?.rich_text[0]?.text?.content || '',
		url: props.URL?.url || '',
		summary: props.AISummary?.rich_text[0]?.text?.content || '',
		source: props.Source?.select?.name || '',
		score: props.FOMOScore?.number || 0,
		date: props.PublishDate?.date?.start || '',
		readTime: props.ReadTime?.select?.name || '',
		tags: props.Tags?.multi_select?.map((tag: any) => tag.name) || [],
		dataPoints: JSON.parse(props.DataPoints?.rich_text[0]?.text?.content || '[]')
	};
}

// Read from Notion
export async function getNewsItems(forceRefresh = false) {
	// Return cached data if within TTL
	if (!forceRefresh && Date.now() - lastFetch < CACHE_TTL) {
		return newsCache;
	}

	try {
		const response = await notion.databases.query({
			database_id: NOTION_DATABASE_ID,
			sorts: [{ property: 'PublishDate', direction: 'descending' }],
			filter: {
				property: 'Status',
				select: {
					equals: 'Published'
				}
			}
		});

		newsCache = response.results.map(mapNotionToNews);
		lastFetch = Date.now();
		return newsCache;
	} catch (error) {
		console.error('Error fetching from Notion:', error);
		return newsCache; // Return cached data on error
	}
}

// Write to Notion (for your Make.com webhook to use)
export async function createNewsItem(data: any) {
	try {
		const response = await notion.pages.create({
			parent: { database_id: NOTION_DATABASE_ID },
			properties: {
				Headline: {
					rich_text: [{ text: { content: data.title } }]
				},
				URL: {
					url: data.url
				},
				Status: {
					select: {
						name: 'Pending'
					}
				},
				PublishDate: {
					date: {
						start: new Date().toISOString()
					}
				},
				Source: {
					select: {
						name: data.source || 'Submitted'
					}
				},
				FOMOScore: {
					number: data.fomoScore || 0
				}
				// Add other properties as needed
			}
		});

		return response;
	} catch (error) {
		console.error('Error creating Notion page:', error);
		throw error;
	}
}