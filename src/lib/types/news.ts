// src/lib/types/news.ts

/**
 * Represents an article or news item in the space news aggregator
 * This type maps to the 'news' table in your Supabase database
 */
export interface NewsItem {
	id: number;
	title: string;
	url: string;
	source?: string;
	read_time?: number;
	fomo_score?: number;
	tags?: string[];
	// week_id?: number;
	created_at: string;
	publication_date?: string;
	summary?: string;
	[key: string]: any; // Allow for additional properties
}

/**
 * Represents entities mentioned in news articles
 * This includes people, companies, facilities, and technologies
 */
export interface NewsEntities {
	people?: Person[];
	companies?: Company[];
	facilities?: Facility[];
	technologies?: Technology[];
	[key: string]: any;            // Allow for future expansion
}

export interface Person {
	name: string;
	role?: string;
	company?: string;
}

export interface Company {
	name: string;
	role?: string;
	project?: string;
}

export interface Facility {
	name: string;
	type?: string;
	location?: string;
}

export interface Technology {
	name: string;
	status?: string;
	type?: string;
	specs?: Record<string, any>;
}

/**
 * Represents contextual information about news items
 * This includes timelines, related stories, and narrative context
 */
export interface NewsContext {
	timeline?: {
		phase?: string;
		target_date?: string;
		current_date?: string;
		official_date?: string | null;
		milestones?: Record<string, any>;
	};
	related_stories?: RelatedStory[];
	narrative_thread?: {
		type?: string;
		themes?: string[];
		stakeholders?: string[];
		key_decision_points?: string[];
		key_initiatives?: string[];
		importance?: string;
		impact_areas?: string[];
	};
	market_data?: Record<string, any>;
	performance_metrics?: Record<string, any>;
	challenges?: string[];
	technical_details?: Record<string, any>;
	scientific_significance?: Record<string, any>;
	[key: string]: any;            // Allow for future expansion
}

export interface RelatedStory {
	id: number | null;
	entity: string;
	relationship: string;
}

/**
 * Options for filtering news items
 */
export interface NewsFilters {
	minScore?: number;
	tags?: string[];
	dateStart?: string;
	dateEnd?: string;
	sortBy?: string;
	sortDir?: 'asc' | 'desc';
	offset?: number;
	limit?: number;
}
