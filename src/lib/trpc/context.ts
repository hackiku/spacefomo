// src/lib/trpc/context.ts

import type { RequestEvent } from '@sveltejs/kit';

export async function createContext(event: RequestEvent) {

	const session = await event.locals.supabase.auth.getSession();
	const user = session?.data.session?.user;

	// This would be replaced with your actual admin check
	const isAdmin = Boolean(user);

	return {
		event,
		supabase: event.locals.supabase,
		user,
		isAdmin
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;