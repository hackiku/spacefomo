// src/routes/admin/api/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Types for global window extension
declare global {
	interface Window {
		supabaseClient: any;
	}
}

// Create a single client instance
let clientInstance: any = null;

/**
 * Initialize the Supabase client for browser usage
 */
export function initSupabaseClient() {
	// Only run in browser 
	if (!browser) return null;

	// Return existing instance if already initialized
	if (clientInstance) return clientInstance;

	// Check for required environment variables
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
		console.error('Supabase URL or key is missing!');
		return null;
	}

	try {
		// Create a single client instance
		clientInstance = createClient(
			PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_ANON_KEY,
			{
				auth: {
					persistSession: true,
					autoRefreshToken: true,
				}
			}
		);

		// Add to window for global access
		window.supabaseClient = clientInstance;

		console.log('Supabase client initialized successfully');
		return clientInstance;
	} catch (error) {
		console.error('Failed to initialize Supabase client:', error);
		return null;
	}
}

/**
 * Get the Supabase client instance
 */
export function getSupabaseClient() {
	if (!browser) return null;

	if (clientInstance) {
		return clientInstance;
	}

	return initSupabaseClient();
}

/**
 * Run a simple test query to verify connection
 */
export async function testSupabaseConnection(): Promise<boolean> {
	try {
		if (!browser) return false;

		const client = getSupabaseClient();

		if (!client) {
			return false;
		}

		// Use a simpler test query that's more likely to succeed
		const { error } = await client
			.from('raw_news')
			.select('id') // Just fetch a single column
			.limit(1);  // Limit to 1 row

		return !error;
	} catch (error) {
		console.error('Error testing Supabase connection:', error);
		return false;
	}
}

// Export a pre-initialized client for direct imports
export const supabaseClient = browser ? getSupabaseClient() : null;