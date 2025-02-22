// src/lib/db/news/data/week6.ts

export const week6News = [
	{
		title: "SpaceX's Latest Launch Sets New Record",
		url: "https://space.com/spacex-record-launch",
		source: "Space.com",
		readTime: 4,
		score: 85,
		tags: ["launch", "spacex", "record"],
		weekId: 6
	}
];

// src/lib/db/content/sync.ts
import { week6News } from './weeklyNews/week6';
import { syncNewsItems } from './newsManager';

async function syncAllNews() {
	await syncNewsItems(week6News);
}

syncAllNews();