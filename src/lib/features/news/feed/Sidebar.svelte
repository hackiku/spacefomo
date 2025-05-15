<!-- src/lib/features/news/feed/Sidebar.svelte -->
<script lang="ts">
  import LayoutControls from '../controls/LayoutControls.svelte'; 
  import FilterControls from '../controls/FilterControls.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import { CaretDown, CaretUp, Sliders } from 'phosphor-svelte';

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
  }
  
  function handleTagsChange(tags: string[]) {
    selectedTags = tags;
  }
  
  function handleActiveChange(active: boolean) {
    activeOnly = active;
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
    <div class="space-y-4 w-full border-t border-border pt-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-foreground">
          <Sliders class="h-4 w-4 text-primary" />
          <h3 class="text-sm font-medium">Filters</h3>
        </div>
        <button 
          class="group relative text-xs text-muted-foreground hover:text-foreground transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/10
                 hover:before:translate-x-0 hover:before:translate-y-0
                 cursor-pointer active:scale-95 px-2"
          onclick={() => showFilters = !showFilters}
        >
          <span>{showFilters ? 'Hide' : 'Show'}</span>
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
      class="group relative flex items-center justify-between w-full p-2
             border border-border bg-card/50 text-muted-foreground text-xs
             hover:text-foreground transition-colors
             before:absolute before:inset-0
             before:border before:border-primary/0
             before:translate-x-0.5 before:translate-y-0.5
             before:transition-transform before:duration-300
             hover:before:border-primary/10
             hover:before:translate-x-0 hover:before:translate-y-0"
      aria-expanded={showFilters}
    >
      <div class="flex items-center gap-2">
        <Sliders class="w-3 h-3 text-primary" />
        <span>Filters</span>
      </div>

      {#snippet caretIcon()}
        {#if showFilters}
          <CaretUp class="w-4 h-4" />
        {:else}
          <CaretDown class="w-4 h-4" />
        {/if}
      {/snippet}
      
      {@render caretIcon()}
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

<style>
  /* Hide scrollbar but maintain functionality */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>