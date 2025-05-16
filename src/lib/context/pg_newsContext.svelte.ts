// src/lib/context/pg_newsContext.svelte.ts (pagination trial)
import { getContext, setContext } from 'svelte';
import type { NewsItem } from '$lib/types/news';

// src/lib/context/newsContext.svelte.ts
function createNewsContext() {
	// Core state
	let cachedBatches = $state<Map<number, NewsItem[]>>(new Map());
	let totalItems = $state(0);
	let isLoading = $state(false);

	// Pagination
	let currentPage = $state(1);
	let pageSize = $state(20);

	// Filter state
	let fomoThreshold = $state(50);

	// Calculate which batch contains a specific page
	function getBatchForPage(page: number) {
		const batchSize = 100;
		return Math.floor(((page - 1) * pageSize) / batchSize);
	}

	// Check if we have data for a specific page
	function hasDataForPage(page: number) {
		const batchIndex = getBatchForPage(page);
		return cachedBatches.has(batchIndex);
	}

	// Load a batch of data
	async function loadBatch(batchIndex: number) {
		if (cachedBatches.has(batchIndex)) return;

		isLoading = true;

		try {
			const offset = batchIndex * 100;
			const params = new URLSearchParams({
				offset: offset.toString(),
				batchSize: '100',
				minScore: fomoThreshold.toString()
			});

			const response = await fetch(`/api/v1/news?${params}`);
			const data = await response.json();

			cachedBatches.set(batchIndex, data.items);
			totalItems = data.totalCount;
		} catch (error) {
			console.error('Error loading news batch:', error);
		} finally {
			isLoading = false;
		}
	}

	// Get items for the current page
	const currentPageItems = $derived(() => {
		const startIdx = (currentPage - 1) * pageSize;
		const batchIdx = getBatchForPage(currentPage);
		const batch = cachedBatches.get(batchIdx) || [];

		const offsetInBatch = startIdx - (batchIdx * 100);
		return batch.slice(offsetInBatch, offsetInBatch + pageSize);
	});

	// Load initial data and handle page changes
	$effect(() => {
		loadBatch(getBatchForPage(currentPage));
	});

	return {
		currentPageItems,
		isLoading,
		currentPage,
		totalPages: $derived(() => Math.ceil(totalItems / pageSize)),

		setPage: (page: number) => {
			const batchIdx = getBatchForPage(page);
			if (!cachedBatches.has(batchIdx)) {
				loadBatch(batchIdx);
			}
			currentPage = page;
		},

		setThreshold: (value: number) => {
			fomoThreshold = value;
			cachedBatches.clear();
			loadBatch(getBatchForPage(1));
			currentPage = 1;
		}
	};
}