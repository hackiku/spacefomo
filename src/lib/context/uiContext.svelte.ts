// src/lib/context/uiContext.svelte.ts
import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';

export function createUiContext() {
	// Layout state
	let sidebarMode = $state('default');
	let columnCount = $state(1);

	// Scroll handling state
	let lastScrollY = $state(0);
	let isTopHidden = $state(false);
	let isBottomHidden = $state(false);
	let isNearFooter = $state(false);
	let isScrolling = $state(false);

	// Scroll functions
	function handleScroll() {
		if (!browser) return;

		const currentScrollY = window.scrollY;
		const scrollDelta = Math.abs(currentScrollY - lastScrollY);
		const scrollThreshold = 5;

		isScrolling = true;

		if (scrollDelta > scrollThreshold) {
			if (currentScrollY > lastScrollY) {
				isTopHidden = true;
				isBottomHidden = false;
			} else {
				isTopHidden = false;
				isBottomHidden = true;
			}

			lastScrollY = currentScrollY;
		}

		// Footer visibility check
		const footerPosition = document.querySelector('footer')?.getBoundingClientRect().top;
		const windowHeight = window.innerHeight;
		isNearFooter = footerPosition && footerPosition < windowHeight + 100;

		// Reset scrolling state after a timeout
		clearTimeout(scrollingTimeout);
		scrollingTimeout = setTimeout(() => {
			isScrolling = false;
		}, 150);
	}

	let scrollingTimeout: ReturnType<typeof setTimeout>;

	// Initialize scroll listener
	function initScrollListener() {
		if (browser) {
			window.addEventListener('scroll', handleScroll, { passive: true });
			return () => window.removeEventListener('scroll', handleScroll);
		}
		return () => { };
	}

	// Layout functions
	function setSidebarMode(mode) {
		sidebarMode = mode;
	}

	function setColumnCount(count) {
		columnCount = count;
	}

	return {
		// Layout state
		sidebarMode,
		columnCount,

		// Scroll state
		lastScrollY,
		isTopHidden,
		isBottomHidden,
		isNearFooter,
		isScrolling,

		// Methods
		setSidebarMode,
		setColumnCount,
		handleScroll,
		initScrollListener
	};
}

// Helper to get the UI context
export function useUi() {
	const context = getContext<ReturnType<typeof createUiContext>>('ui');

	if (!context) {
		throw new Error('useUi must be used within a component with UIContext');
	}

	return context;
}