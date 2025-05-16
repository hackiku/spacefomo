// src/lib/trpc/client.ts
import type { Router } from './router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init?: TRPCClientInit) {
	const isBrowser = typeof window !== 'undefined';

	// Fix for the init.url.origin error
	if (!isBrowser && (!init || !init.url)) {
		throw new Error('URL is required for server-side trpc calls');
	}

	if (isBrowser && browserClient) return browserClient;

	const client = createTRPCClient<Router>({
		init: init || {
			// Provide default init values for client-side
			url: isBrowser ? { origin: window.location.origin } : undefined
		}
	});

	if (isBrowser) browserClient = client;
	return client;
}