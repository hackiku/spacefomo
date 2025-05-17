// src/lib/context/uiContext.svelte.ts
import { getContext, setContext } from 'svelte';

export function createUiContext() {
	let sidebarMode = $state('default');
	let columnCount = $state(1);

	function setSidebarMode(mode) {
		sidebarMode = mode;
	}

	function setColumnCount(count) {
		columnCount = count;
	}

	return {
		// Direct state properties
		sidebarMode,
		columnCount,

		// Methods
		setSidebarMode,
		setColumnCount
	};
}