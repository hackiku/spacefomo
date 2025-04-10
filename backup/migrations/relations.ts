import { relations } from "drizzle-orm/relations";
import { weeks, submissions, news } from "./schema";

export const submissionsRelations = relations(submissions, ({one}) => ({
	week: one(weeks, {
		fields: [submissions.weekId],
		references: [weeks.id]
	}),
}));

export const weeksRelations = relations(weeks, ({many}) => ({
	submissions: many(submissions),
	news: many(news),
}));

export const newsRelations = relations(news, ({one}) => ({
	week: one(weeks, {
		fields: [news.weekId],
		references: [weeks.id]
	}),
}));