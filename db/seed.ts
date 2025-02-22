// src/lib/db/seed.ts
import { db } from './index';
import { weeks } from './schema';

const seedData = [
	{
		weekNumber: 5,
		score: 85,
		startDate: new Date('2024-02-17'),
		endDate: new Date('2024-02-23'),
		summary: "SpaceX's Starship orbital test exceeds expectations. Private sector space competition intensifies as Rocket Lab announces new heavy-lift vehicle development.",
		stats: {
			launchActivity: 92,
			industryBuzz: 88,
			techImpact: 85
		}
	},
	// ... add other weeks here
];

async function seed() {
	try {
		console.log('🌱 Seeding database...');
		await db.insert(weeks).values(seedData);
		console.log('✅ Seeding complete!');
	} catch (error) {
		console.error('❌ Seeding failed:', error);
	}
	process.exit(0);
}

seed();