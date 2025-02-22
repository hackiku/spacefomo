// src/lib/db/manage.ts
import { db } from './index';
import { weeks } from './schema';

export async function addNewWeek(weekData: {
	summary: string;
	score: number;
	stats: {
		launchActivity: number;
		industryBuzz: number;
		techImpact: number;
	}
}) {
	const lastWeek = await db.query.weeks.findFirst({
		orderBy: [desc(weeks.weekNumber)]
	});

	const newWeekNumber = (lastWeek?.weekNumber || 0) + 1;

	return db.insert(weeks).values({
		weekNumber: newWeekNumber,
		startDate: new Date(), // Set appropriate dates
		endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		...weekData
	});
}