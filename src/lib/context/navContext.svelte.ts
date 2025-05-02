// src/lib/context/navContext.svelte.ts
import { getContext } from 'svelte';

export function createNavContext() {
	// Mobile menu state
	let isMobileMenuOpen = $state(false);

	// About drawer state
	let showAbout = $state(false);

	// Navigation visibility state
	let lastScrollY = $state(0);
	let isHidden = $state(false);

	// Toggle mobile menu
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		// Close about drawer if open
		if (isMobileMenuOpen && showAbout) {
			showAbout = false;
		}
	}

	// Toggle about drawer
	function toggleAbout() {
		showAbout = !showAbout;
		// Close mobile menu if open
		if (showAbout && isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	// Open about drawer
	function openAbout() {
		showAbout = true;
		if (isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	// Close about drawer
	function closeAbout() {
		showAbout = false;
	}

	// Update scroll position and manage visibility
	function updateScrollPosition(currentScrollY: number) {
		// Hide nav when scrolling down, show when scrolling up
		isHidden = currentScrollY > lastScrollY && currentScrollY > 50;
		lastScrollY = currentScrollY;
	}

	return {
		isMobileMenuOpen,
		showAbout,
		isHidden,
		toggleMobileMenu,
		toggleAbout,
		openAbout,
		closeAbout,
		updateScrollPosition
	};
}

// Helper to get the navigation context
export function useNav() {
	const context = getContext<ReturnType<typeof createNavContext>>('nav');

	if (!context) {
		throw new Error('useNav must be used within a component with NavContext');
	}

	return context;
}