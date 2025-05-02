// src/lib/context/navContext.svelte.ts
import { getContext } from 'svelte';

export function createNavContext() {
	// Core state
	let showAbout = $state(false);
	let isMobileMenuOpen = $state(false);
	let lastScrollY = $state(0);
	let isHidden = $state(false);

	// Methods
	function toggleAbout() {
		showAbout = !showAbout;
		// Close mobile menu when opening about
		if (showAbout && isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	function openAbout() {
		showAbout = true;
		// Close mobile menu when opening about
		if (isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	function closeAbout() {
		showAbout = false;
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		// Close about drawer when opening mobile menu
		if (isMobileMenuOpen && showAbout) {
			showAbout = false;
		}
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	function updateScrollPosition(currentScrollY: number) {
		isHidden = currentScrollY > lastScrollY && currentScrollY > 50;
		lastScrollY = currentScrollY;
	}

	return {
		// State
		showAbout,
		isMobileMenuOpen,
		lastScrollY,
		isHidden,

		// Methods
		toggleAbout,
		openAbout,
		closeAbout,
		toggleMobileMenu,
		closeMobileMenu,
		updateScrollPosition
	};
}

// Helper to get the nav context
export function getNavContext() {
	const context = getContext<ReturnType<typeof createNavContext>>('nav');

	if (!context) {
		throw new Error('useNav must be used within a component with NavContext');
	}

	return context;
}

// Helper to create a hook for nav data
export function useNav() {
	return getNavContext();
}