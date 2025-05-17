<!-- src/lib/features/news/layout/Sidebar.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import LayoutControls from '../controls/LayoutControls.svelte';
	import type { SidebarMode, ColumnCount } from '$lib/types/layout';
	import { Sliders, ArrowsOutSimple, ArrowsInSimple } from 'phosphor-svelte';

	// Props - receive state from parent
	let {
		sidebarMode,
		columnCount,
		fomoThreshold,
		selectedTags = [],
		onSidebarModeChange,
		onColumnCountChange,
		onFomoThresholdChange,
		onTagsChange
	} = $props<{
		sidebarMode: SidebarMode;
		columnCount: ColumnCount;
		fomoThreshold: number;
		selectedTags: string[];
		onSidebarModeChange: (mode: SidebarMode) => void;
		onColumnCountChange: (count: ColumnCount) => void;
		onFomoThresholdChange: (val: number) => void;
		onTagsChange: (tags: string[]) => void;
	}>();

	// State
	let isExpanded = $state(false);

	// Toggle expanded state
	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	// Handle keyboard accessibility for expanding
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			toggleExpanded();
			e.preventDefault();
		}
	}

	// Handle FOMO threshold change
	function handleFomoChange(value: number) {
		if (fomoThreshold !== value) {
			onFomoThresholdChange(value);
		}
	}

	// Handle tag selection
	function handleTagSelect(tag: string) {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];

		onTagsChange(newTags);
	}

	function clearTags() {
		onTagsChange([]);
	}

	// Mock available tags for demo
	const availableTags = [
		'launch',
		'rocket',
		'satellite',
		'mars',
		'moon',
		'nasa',
		'spacex',
		'esa',
		'isro',
		'commercial',
		'science',
		'artemis'
	];
</script>

<!-- Absolutely positioned sidebar -->
<div
	class="bg-background fixed top-20 left-4 z-20 overflow-visible md:absolute
         md:top-0 md:left-0 md:bg-transparent"
>
	<!-- Main sidebar container -->
	<div
		class={cn(
			'bg-background p-4 rounded-xl overflow-hidden transition-all duration-300',
			isExpanded
				? 'w-64 backdrop-blur-sm md:rounded-xl'
				: 'w-auto'
		)}
	>
		<!-- Toggle button and layout controls -->
		<div class="flex flex-col items-center justify-between">
			<button
				type="button"
				class={cn(
					'text-muted-foreground hover:text-foreground rounded-md p-2 transition-colors',
					isExpanded && 'text-foreground'
				)}
				onclick={toggleExpanded}
				onkeydown={handleKeyDown}
				aria-label={isExpanded ? 'Collapse settings' : 'Expand settings'}
			>
				{#if isExpanded}
					<ArrowsInSimple class="h-5 w-5" />
				{:else}
					<ArrowsOutSimple class="h-5 w-5" />
				{/if}
			</button>
			{#if !isExpanded}
				<!-- Compact layout controls when collapsed -->
				<div class="px-1">
					<LayoutControls
						{sidebarMode}
						{columnCount}
						compact={true}
						{onSidebarModeChange}
						{onColumnCountChange}
					/>
				</div>
			{/if}
		</div>

		<!-- Expanded content -->
		{#if isExpanded}
			<div class="mt-4 space-y-6">
				<!-- Layout Controls -->
				<div>
					<h3 class="text-foreground mb-3 text-sm font-medium">Layout</h3>

					<LayoutControls
						{sidebarMode}
						{columnCount}
						compact={false}
						{onSidebarModeChange}
						{onColumnCountChange}
					/>
				</div>

				<!-- Filter section -->
				<div class="border-border/50 border-t pt-4">
					<div class="mb-3 flex items-center gap-2">
						<Sliders class="text-primary h-4 w-4" />
						<h3 class="text-foreground text-sm font-medium">Filters</h3>
					</div>

					<!-- FOMO Threshold slider -->
					<div class="mb-4 space-y-2">
						<div class="flex items-center justify-between">
							<label for="fomo-slider" class="text-muted-foreground text-sm"> FOMO Score </label>
							<span class="text-sm">{fomoThreshold}</span>
						</div>

						<input
							id="fomo-slider"
							type="range"
							min="0"
							max="100"
							step="1"
							value={fomoThreshold}
							oninput={(e) => handleFomoChange(parseInt(e.currentTarget.value))}
							class="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg"
						/>
					</div>

					<!-- Tags -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<h4 class="text-muted-foreground text-sm">Tags</h4>
							{#if selectedTags.length > 0}
								<button
									type="button"
									class="text-primary text-xs hover:underline"
									onclick={clearTags}
								>
									Clear
								</button>
							{/if}
						</div>

						<div class="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pb-2">
							{#each availableTags as tag}
								<button
									type="button"
									class={cn(
										'rounded-sm border px-2 py-0.5 text-xs transition-colors',
										selectedTags.includes(tag)
											? 'bg-primary/10 border-primary/30 text-foreground'
											: 'bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground'
									)}
									onclick={() => handleTagSelect(tag)}
								>
									{tag}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
