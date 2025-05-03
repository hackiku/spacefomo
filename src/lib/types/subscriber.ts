// src/lib/types/subscriber.ts
export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced';

export interface Subscriber {
	id: number;
	email: string;
	status: SubscriberStatus;
	created_at: string;
	updated_at: string | null;
	submission_id: number | null;
}