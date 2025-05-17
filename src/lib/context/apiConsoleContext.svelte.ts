// src/lib/context/apiConsoleContext.svelte.ts
import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';

export interface ApiLog {
	function: string;
	timestamp: number;
	payload: any;
	response: any;
	success: boolean;
}

export function createApiConsoleContext() {
	// State for API logs
	let logs = $state<ApiLog[]>([]);
	let isOpen = $state(false);
	let isExpanded = $state(true);
	let selectedLogIndex = $state(0);

	// Log an API call
	function logApiCall(log: ApiLog) {
		if (!browser) return;

		logs = [log, ...logs];

		// Auto-select the newest log
		selectedLogIndex = 0;

		// Auto-open the console when there's activity
		if (!isOpen && logs.length === 1) {
			isOpen = true;
		}
	}

	// Clear all logs
	function clearLogs() {
		logs = [];
	}

	// Toggle console visibility
	function toggleConsole() {
		isOpen = !isOpen;
	}

	// Toggle expanded view
	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	// Select a specific log
	function selectLog(index: number) {
		selectedLogIndex = index;
	}

	// Format JSON for display
	function formatJson(json: any): string {
		try {
			return JSON.stringify(json, null, 2);
		} catch (error) {
			return String(json);
		}
	}

	// Copy to clipboard
	function copyToClipboard(text: string) {
		if (!browser) return;

		navigator.clipboard.writeText(text)
			.then(() => {
				// Could add a notification here
			})
			.catch(err => {
				console.error('Could not copy text: ', err);
			});
	}

	return {
		// State
		logs,
		isOpen,
		isExpanded,
		selectedLogIndex,

		// Methods
		logApiCall,
		clearLogs,
		toggleConsole,
		toggleExpanded,
		selectLog,
		formatJson,
		copyToClipboard
	};
}

// Helper to get the API console context
export function useApiConsole() {
	const context = getContext<ReturnType<typeof createApiConsoleContext>>('apiConsole');

	if (!context) {
		throw new Error('useApiConsole must be used within a component with ApiConsoleContext');
	}

	return context;
}