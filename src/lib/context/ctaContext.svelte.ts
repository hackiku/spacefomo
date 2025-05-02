// src/lib/context/ctaContext.svelte.ts
import { getContext } from 'svelte';

export function createCtaContext() {
	// Share modal state
	let isShareModalOpen = $state(false);

	// Open/close share modal
	function openShareModal() {
		isShareModalOpen = true;
	}

	function closeShareModal() {
		isShareModalOpen = false;
	}

	// Track successful submissions
	let lastSubmission = $state<{
		type: 'share' | 'subscribe';
		timestamp: Date;
		data?: Record<string, any>;
	} | null>(null);

	function trackSubmission(type: 'share' | 'subscribe', data?: Record<string, any>) {
		lastSubmission = {
			type,
			timestamp: new Date(),
			data
		};
	}

	return {
		isShareModalOpen,
		openShareModal,
		closeShareModal,
		lastSubmission,
		trackSubmission
	};
}

// Helper to get the CTA context
export function getCtaContext() {
	return getContext<ReturnType<typeof createCtaContext>>('cta');
}