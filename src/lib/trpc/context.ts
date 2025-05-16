// src/lib/trpc/context.ts

import type { RequestEvent } from '@sveltejs/kit';

export async function createContext(event: RequestEvent) {
	// This context object will be available in all your procedures
	// You can add user authentication here later
	return {
		event,
		supabase: event.locals.supabase,

	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;