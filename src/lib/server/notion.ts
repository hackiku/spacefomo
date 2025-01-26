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

// src/lib/server/notion.ts

function mapNotionToNews(page: any): NewsItem {
	const props = page.properties;

	try {
		// Required fields
		const newsItem: NewsItem = {
			id: page.id,
			title: props.title?.rich_text[0]?.plain_text || 'Untitled',
			url: props.url?.url || '#',
		};

		// Optional fields - only add if they exist
		if (props.summary?.rich_text?.[0]?.plain_text) {
			newsItem.summary = props.summary.rich_text[0].plain_text;
		}

		if (props.type?.select?.name) {
			newsItem.type = props.type.select.name as ArticleType;
		}

		if (props.status?.select?.name) {
			newsItem.status = props.status.select.name as ArticleStatus;
		}

		if (page.created_time) {
			newsItem.createdTime = page.created_time;
		}

		if (props.week?.formula?.number !== undefined) {
			newsItem.week = props.week.formula.number;
		}

		if (props.readTime?.number !== undefined) {
			newsItem.readTime = props.readTime.number;
		}

		if (props.score?.number !== undefined) {
			newsItem.score = props.score.number;
		}

		if (props.date?.date?.start) {  // Notice this is different - Notion date fields use this structure
			newsItem.date = props.date.date.start;
		}

		if (props.source?.select?.name) {
			newsItem.source = props.source.select.name;
		}

		if (props.tags?.multi_select?.length > 0) {
			newsItem.tags = props.tags.multi_select.map((tag: any) => tag.name);
		}

		if (props.weeklyRank?.formula?.number !== undefined) {
			newsItem.weeklyRank = props.weeklyRank.formula.number;
		}

		// Handle DataPoints JSON
		if (props.dataPoints?.rich_text?.[0]?.plain_text) {
			try {
				newsItem.dataPoints = JSON.parse(props.dataPoints.rich_text[0].plain_text);
			} catch (e) {
				console.warn('Failed to parse dataPoints JSON:', e);
			}
		}

		return newsItem;
	} catch (error) {
		console.error('Error mapping Notion page:', error);
		return {
			id: page.id || `error-${Date.now()}`,
			title: 'Error Loading Article',
			url: '#'
		};
	}
}

export async function getNewsItems(forceRefresh = false) {
	if (!forceRefresh && Date.now() - lastFetch < CACHE_TTL) {
		return newsCache;
	}

	try {
		const response = await notion.databases.query({
			database_id: NOTION_DATABASE_ID,
			// filter: {
			// 	property: 'status',
			// 	select: {
			// 		equals: 'Published'
			// 	}
			// },
			sorts: [
				{
					property: 'createdTime',
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
			title: {
				rich_text: [{ text: { content: data.title?.slice(0, 2000) || '' } }]
			},
			url: {
				url: data.url || ''
			},
			status: {
				select: {
					name: 'Pending'
				}
			},
			date: {
				date: {
					start: new Date().toISOString()
				}
			},
			source: {
				select: {
					name: data.source || 'Submitted'
				}
			},
			score: {
				number: data.score || 0
			}
		}
	});
}
