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
			title: props.Headline?.rich_text[0]?.plain_text || 'Untitled',
			url: props.URL?.url || '#',
		};

		// Optional fields - only add if they exist
		if (props.AISummary?.rich_text?.[0]?.plain_text) {
			newsItem.summary = props.AISummary.rich_text[0].plain_text;
		}

		if (props.Type?.select?.name) {
			newsItem.type = props.Type.select.name as ArticleType;
		}

		if (props.Status?.select?.name) {
			newsItem.status = props.Status.select.name as ArticleStatus;
		}

		if (page.created_time) {
			newsItem.createdTime = page.created_time;
		}

		if (props.Week?.formula?.number !== undefined) {
			newsItem.week = props.Week.formula.number;
		}

		if (props.ReadTime?.number !== undefined) {
			newsItem.readTime = props.ReadTime.number;
		}

		if (props.FOMOScore?.number !== undefined) {
			newsItem.score = props.FOMOScore.number;
		}

		if (props.PublishDate?.rich_text?.[0]?.plain_text) {
			newsItem.date = props.PublishDate.rich_text[0].plain_text;
		}

		if (props.Source?.select?.name) {
			newsItem.source = props.Source.select.name;
		}

		if (props.Tags?.multi_select?.length > 0) {
			newsItem.tags = props.Tags.multi_select.map((tag: any) => tag.name);
		}

		if (props.WeeklyRank?.formula?.number !== undefined) {
			newsItem.weeklyRank = props.WeeklyRank.formula.number;
		}

		// Handle DataPoints JSON
		if (props.DataPoints?.rich_text?.[0]?.plain_text) {
			try {
				newsItem.dataPoints = JSON.parse(props.DataPoints.rich_text[0].plain_text);
			} catch (e) {
				console.warn('Failed to parse DataPoints JSON:', e);
			}
		}

		return newsItem;
	} catch (error) {
		console.error('Error mapping Notion page:', error);
		// Return minimal valid item
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