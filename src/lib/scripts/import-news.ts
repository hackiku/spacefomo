// scripts/import-news.ts
// src/lib/scripts/import-news.ts

import fs from 'fs/promises';
import path from 'path';

async function importNews() {
	try {
		// Read the news data
		const newsFile = await fs.readFile(
			path.join(process.cwd(), 'src/lib/data/news.json'),
			'utf-8'
		);
		const news = JSON.parse(newsFile);

		// Send to your webhook
		const response = await fetch('http://localhost:5173/api/import-news', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(news)
		});

		const result = await response.json();
		console.log('Import result:', result);
	} catch (error) {
		console.error('Import failed:', error);
	}
}

importNews();