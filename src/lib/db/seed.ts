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
	{
		weekNumber: 4,
		score: 72,
		startDate: new Date('2024-02-10'),
		endDate: new Date('2024-02-16'),
		summary: "NASA confirms critical Artemis milestone ahead of schedule. Blue Origin's New Glenn preparations signal major launch capabilities expansion.",
		stats: {
			launchActivity: 75,
			industryBuzz: 70,
			techImpact: 71
		}
	},
	{
		weekNumber: 3,
		score: 68,
		startDate: new Date('2024-02-03'),
		endDate: new Date('2024-02-09'),
		summary: "ESA and JAXA announce joint Mars sample return mission. Virgin Galactic achieves new altitude record with next-gen spacecraft.",
		stats: {
			launchActivity: 65,
			industryBuzz: 72,
			techImpact: 67
		}
	},
	{
		weekNumber: 2,
		score: 78,
		startDate: new Date('2024-01-27'),
		endDate: new Date('2024-02-02'),
		summary: "Breakthrough in space solar power transmission demos practical energy beaming. China's space station expansion enters new phase.",
		stats: {
			launchActivity: 80,
			industryBuzz: 75,
			techImpact: 79
		}
	},
	{
		weekNumber: 1,
		score: 65,
		startDate: new Date('2024-01-20'),
		endDate: new Date('2024-01-26'),
		summary: "First commercial lunar lander touches down successfully. Space tourism bookings surge as new providers enter market.",
		stats: {
			launchActivity: 68,
			industryBuzz: 62,
			techImpact: 65
		}
	}
];

async function seed() {
	try {
		console.log('🌱 Seeding database...');

		// Clean existing data
		await db.delete(weeks);

		// Insert new data
		await db.insert(weeks).values(seedData);
		console.log('✅ Seeding complete!');
	} catch (error) {
		console.error('❌ Seeding failed:', error);
	}
	process.exit(0);
}

seed();