// src/lib/server/notion.ts
import { NOTION_API_KEY, NOTION_DATABASE_ID } from '$env/static/private';
import pkg from '@notionhq/client';
import { dev } from '$app/environment';
import type { NewsItem } from '$lib/types';

const { Client } = pkg;
const notion = new Client({ auth: NOTION_API_KEY });

// Cache news items with a TTL
let newsCache: NewsItem[] = [];
let lastFetch = 0;
const CACHE_TTL = dev ? 1000 * 60 : 1000 * 60 * 15; // 1 min dev, 15 min prod

function mapNotionToNews(page: any): NewsItem {
	const props = page.properties;

	try {
		return {
			id: page.id,
			title: props.Headline?.rich_text[0]?.plain_text || '',
			url: props.URL?.url || '',
			summary: props.AISummary?.rich_text[0]?.plain_text || '',
			source: props.Source?.select?.name || '',
			score: props.FOMOScore?.number || 0,
			date: props.PublishDate?.date?.start || '',
			readTime: props.ReadTime?.select?.name || '',
			tags: props.Tags?.multi_select?.map((tag: any) => tag.name) || [],
			dataPoints: props.DataPoints?.rich_text[0]?.plain_text ?
				JSON.parse(props.DataPoints.rich_text[0].plain_text) : []
		};
	} catch (error) {
		console.error('Error mapping Notion page:', error);
		return null;
	}
}

export async function getNewsItems(forceRefresh = false) {
	if (!forceRefresh && Date.now() - lastFetch < CACHE_TTL) {
		return newsCache;
	}

	try {
		const response = await notion.databases.query({
			database_id: NOTION_DATABASE_ID,
			filter: {
				property: 'Status',
				select: {
					equals: 'Published'
				}
			},
			sorts: [
				{
					property: 'PublishDate',
					direction: 'descending'
				}
			],
			page_size: 100 // Adjust based on your needs
		});

		newsCache = response.results
			.map(mapNotionToNews)
			.filter(item => item !== null);
		lastFetch = Date.now();
		return newsCache;
	} catch (error) {
		console.error('Error fetching from Notion:', error);
		return newsCache;
	}
}

// For your Make.com webhook
export async function createNewsItem(data: any) {
	return await notion.pages.create({
		parent: { database_id: NOTION_DATABASE_ID },
		properties: {
			Headline: {
				rich_text: [{ text: { content: data.title?.slice(0, 2000) || '' } }]
			},
			URL: {
				url: data.url || ''
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
		}
	});
}