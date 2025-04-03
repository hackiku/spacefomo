// src/lib/db/news/validate.ts
import { week6News } from './data/week6';

function validateNewsItem(item: any) {
	const requiredFields = ['title', 'url', 'weekId'];
	const missing = requiredFields.filter(field => !item[field]);

	if (missing.length > 0) {
		throw new Error(`Missing required fields: ${missing.join(', ')} in item: ${item.title}`);
	}
}

async function validateAllNews() {
	try {
		week6News.forEach(validateNewsItem);
		console.log('All news items validated successfully');
	} catch (error) {
		console.error('Validation failed:', error);
		process.exit(1);
	}
}

validateAllNews();