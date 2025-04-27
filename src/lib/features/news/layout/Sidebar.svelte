<!-- src/lib/features/news/layout/Sidebar.svelte -->
<script lang="ts">
  import LayoutControls from '../controls/LayoutControls.svelte'; 
  import FilterControls from '../controls/FilterControls.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import { CaretDown, CaretUp } from 'phosphor-svelte';

  let { 
    sidebarMode, columnCount, compact,
    onSidebarModeChange, onColumnCountChange
  } = $props<{
    sidebarMode: SidebarMode;
    columnCount: ColumnCount;
    compact: boolean;
    onSidebarModeChange: (mode: SidebarMode) => void;
    onColumnCountChange: (count: ColumnCount) => void;
  }>();

  // Initialize local state
  let showFilters = $state(true);
  
  // Filter values with defaults
  let fomoScore = $state(50);
  let selectedTags = $state<string[]>([]);
  let activeOnly = $state(false);
  
  // Handle filter changes
  function handleFomoChange(value: number) {
    fomoScore = value;
    // You could add additional logic here (like API calls)
  }
  
  function handleTagsChange(tags: string[]) {
    selectedTags = tags;
    // Additional logic as needed
  }
  
  function handleActiveChange(active: boolean) {
    activeOnly = active;
    // Additional logic as needed
  }
</script>

<div class="flex flex-col gap-6 py-4 w-full">
  <!-- Controls Section -->
  <LayoutControls 
    {sidebarMode}
    {columnCount}
    {compact}
    onSidebarModeChange={onSidebarModeChange}
    onColumnCountChange={onColumnCountChange}
  />

  {#if !compact}
    <!-- Full filter section -->
    <div class="space-y-4 w-full">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-zinc-300">Filters</h3>
        <button 
          class="text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
          onclick={() => showFilters = !showFilters}
        >
          {showFilters ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {#if showFilters}
        <FilterControls 
          fomoThreshold={fomoScore}
          selectedTags={selectedTags}
          showOnlyActive={activeOnly}
          onFomoThresholdChange={handleFomoChange}
          onSelectedTagsChange={handleTagsChange}
          onShowOnlyActiveChange={handleActiveChange}
        />
      {/if}
    </div>
  {:else if compact}
    <!-- Compact filter toggle button -->
    <button
      type="button"
      onclick={() => showFilters = !showFilters}
      class="flex items-center justify-between w-full p-2 rounded-lg 
             border border-zinc-800 text-zinc-400 text-xs
             hover:bg-zinc-800/50 hover:text-zinc-300 transition-colors"
      aria-expanded={showFilters}
    >
      <span>Filters</span>

			<!-- TODO: change to {#snippet} -->
      <svelte:component this={showFilters ? CaretUp : CaretDown} class="w-4 h-4" />
    </button>
    
    {#if showFilters}
      <div class="pt-1">
        <FilterControls 
          compact={true}
          fomoThreshold={fomoScore}
          selectedTags={selectedTags}
          showOnlyActive={activeOnly}
          onFomoThresholdChange={handleFomoChange}
          onSelectedTagsChange={handleTagsChange}
          onShowOnlyActiveChange={handleActiveChange}
        />
      </div>
    {/if}
  {/if}
</div>