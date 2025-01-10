// src/lib/types/database.ts

// supabase scaffold
export interface NewsSubmission {
	id: string
	url: string
	status: 'pending' | 'approved' | 'rejected'
	submitted_at: string
	processed_at?: string
	submitter_ip?: string
	title?: string
	summary?: string
	fomo_score?: number
}

export interface ProcessedArticle {
	id: string
	url: string
	title: string
	summary: string
	tldr: string
	fomo_score: number
	source: string
	read_time: string
	data_points: Array<{ label: string, value: string }>
	processed_at: string
}