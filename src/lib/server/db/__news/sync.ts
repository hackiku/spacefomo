// src/lib/db/news/sync.ts
import { week6News } from './data/week6';
import { syncNewsItems } from './newsManager';

async function syncAllNews() {
	await syncNewsItems(week6News);
}

syncAllNews();
