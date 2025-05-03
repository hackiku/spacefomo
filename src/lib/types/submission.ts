// src/lib/types/submission.ts


export interface Submission {
	id: number;
	url: string;
	comment: string | null;
	fomo_score: number | null;
	email: string | null;
	published: boolean;
	created_at: string;
	week_id: number | null;
}