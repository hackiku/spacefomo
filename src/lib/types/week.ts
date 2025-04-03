// src/lib/types/week.ts

export interface WeekItem {
	id: number;
	week_number: number;
	startDate: Date;
	endDate: Date;
	createdAt: Date;
	title?: string;
	description?: string;
}