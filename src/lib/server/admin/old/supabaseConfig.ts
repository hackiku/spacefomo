// src/routes/admin/api/supabaseConfig.ts

import { browser } from '$app/environment';

/**
 * Core configuration for Supabase API connections
 */

// Environment variables with browser check
const getEnvVar = (key: string): string => {
	if (!browser) return '';
	return import.meta.env[key] || '';
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Base function to call any Supabase Edge Function
 */
export async function callEdgeFunction<T>(
	functionName: string,
	payload: any = {},
	options: { method?: string; headers?: Record<string, string> } = {}
): Promise<ApiResponse<T>> {

	if (!browser) {
		return {
			success: false,
			error: 'Edge function calls can only be made in the browser'
		};
	}

	try {
		if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
			throw new Error('Supabase configuration is missing');
		}

		const url = `${SUPABASE_URL}/functions/v1/${functionName}`;

		const method = options.method || 'POST';
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
			...options.headers
		};

		const requestOptions: RequestInit = {
			method,
			headers,
			body: method !== 'GET' ? JSON.stringify(payload) : undefined,
		};

		const response = await fetch(url, requestOptions);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || `HTTP error ${response.status}`);
		}

		const result = await response.json();
		return { success: true, data: result };

	} catch (error) {
		console.error(`Error calling ${functionName}:`, error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Get Edge Function URL for direct access (useful for monitoring)
 */
export function getEdgeFunctionUrl(functionName: string): string {
	if (!browser) return '';
	return `${SUPABASE_URL}/functions/v1/${functionName}`;
}