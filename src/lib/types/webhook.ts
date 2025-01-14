// src/lib/types/webhook.ts
export interface LinkSubmissionPayload {
	url: string;
	timestamp: string;
	userAgent: string | null;
	source: string;
}

export interface EmailSubscriptionPayload {
	email: string;
	timestamp: string;
	userAgent: string | null;
	source: string;
	tags: string[];
	subscriptionType: string;
}
