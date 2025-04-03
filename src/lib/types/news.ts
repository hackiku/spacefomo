// src/lib/types/news.ts

/**
 * Represents an article or news item in the space news aggregator
 * This type maps to the 'news' table in your Supabase database
 */
export interface NewsItem {
	// Core identifiers
	id: number;
	title: string;
	url: string;
	source: string | null;

	// Content metadata
	read_time: number | null;      // Estimated reading time in minutes
	viral_title: string | null;    // Catchier/alternative title for social sharing

	// Classification and scoring
	fomo_score: number | null;     // Fear-of-missing-out score (importance)
	impact_score: number | null;   // Impact on space industry/community

	// Organization and filtering
	tags: string[] | null;         // Array of topic tags for filtering
	week_id: number | null;        // Reference to weekly buckets of content

	// Rich data structures
	entities: NewsEntities | null; // Structured data about entities mentioned
	context: NewsContext | null;   // Additional contextual information

	// Timestamps
	created_at: Date;              // When the item was added to our system
	publication_date: Date | null; // Original publication date of the article
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
	limit: number;
	offset: number;
	tags: string[];
	weekId: number | null;
	minScore: number;
}