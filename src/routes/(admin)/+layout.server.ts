// src/routes/(admin)/+layout.server.ts
import { createCaller } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	// Check for authentication
	const session = await event.locals.supabase.auth.getSession();

	// Authentication check (commented out for now)
	// if (!session?.data.session?.user) {
	//   throw redirect(303, '/login?redirect=/admin');
	// }

	// Create TRPC caller
	const trpc = createCaller(await createContext(event));

	try {
		// Load admin dashboard data
		const [rawNewsStats, apiUsage] = await Promise.all([
			trpc.admin.getRawNewsStats(),
			trpc.admin.getApiUsage()
		]);

		return {
			rawNewsStats,
			apiUsage,
			user: session?.data.session?.user
		};
	} catch (error) {
		console.error('Error loading admin data:', error);
		return {
			error: error instanceof Error ? error.message : 'Failed to load admin data',
			rawNewsStats: [],
			apiUsage: { providers: [], totalCost: 0 },
			user: session?.data.session?.user
		};
	}
}