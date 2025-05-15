<!-- src/lib/features/news/feed/Sidebar.svelte -->
<script lang="ts">
  import { cn } from '$lib/utils';
  import LayoutControls from '../controls/LayoutControls.svelte'; 
  import FilterControls from '../controls/FilterControls.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import { Sliders, CaretDown, CaretUp, ArrowsInLineHorizontal, Columns, Table, Rows, SquaresFour } from 'phosphor-svelte';
  import { ToggleGroup } from "bits-ui";

  // Bindable props
  let { 
    sidebarMode = $bindable<SidebarMode>('default'),
    columnCount = $bindable<ColumnCount>(1)
  } = $props();

  // State
  let isExpanded = $state(false);
  
  // Filter values with defaults
  let fomoScore = $state(50);
  let selectedTags = $state<string[]>([]);
  let activeOnly = $state(false);
  
  // Toggle expanded state
  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  // Handle layout & column changes
  function handleLayoutChange(layout: string | string[]) {
    if (typeof layout === 'string') {
      sidebarMode = layout as SidebarMode;
    }
  }

  function handleColumnChange(columns: string | string[]) {
    if (typeof columns === 'string') {
      columnCount = Number(columns) as ColumnCount;
    }
  }
  
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

<div class="sidebar-container">
  <!-- Collapsed state - visible always -->
  <div 
    class={cn(
      "bg-background rounded-2xl shadow-md border border-border overflow-hidden transition-all duration-300",
      isExpanded ? "opacity-0 pointer-events-none absolute" : "opacity-100"
    )}
    onclick={toggleExpanded}
  >
    <!-- Two rows of controls stacked on top of each other -->
    <div class="p-3 space-y-3">
      <!-- Top row: Layout Controls -->
      <div class="border border-border bg-muted/30">
        <ToggleGroup.Root
          type="single"
          value={sidebarMode}
          onValueChange={handleLayoutChange}
          orientation="vertical"
          class="flex flex-col"
        >
          <ToggleGroup.Item
            value="thin"
            aria-label="Compact view"
            class="data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:border-r-2 data-[state=on]:border-primary
                  h-8 w-8 flex items-center justify-center 
                  text-muted-foreground hover:text-foreground focus-visible:outline-none"
            onclick={(e) => e.stopPropagation()}
          >
            <ArrowsInLineHorizontal class="h-4 w-4" />
          </ToggleGroup.Item>
          
          <ToggleGroup.Item
            value="default"
            aria-label="Default layout"
            class="data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:border-r-2 data-[state=on]:border-primary
                  h-8 w-8 flex items-center justify-center 
                  text-muted-foreground hover:text-foreground focus-visible:outline-none"
            onclick={(e) => e.stopPropagation()}
          >
            <Columns class="h-4 w-4" />
          </ToggleGroup.Item>
          
          <ToggleGroup.Item
            value="wide"
            aria-label="Wide layout"
            class="data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:border-r-2 data-[state=on]:border-primary
                  h-8 w-8 flex items-center justify-center 
                  text-muted-foreground hover:text-foreground focus-visible:outline-none"
            onclick={(e) => e.stopPropagation()}
          >
            <Table class="h-4 w-4" />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <!-- Bottom row: Column Toggle -->
      <div class="border border-border bg-muted/30">
        <ToggleGroup.Root
          type="single"
          value={String(columnCount)}
          onValueChange={handleColumnChange}
          orientation="vertical"
          class="flex flex-col"
        >
          <ToggleGroup.Item
            value="1"
            aria-label="Single column"
            class="data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:border-r-2 data-[state=on]:border-primary
                  h-8 w-8 flex items-center justify-center 
                  text-muted-foreground hover:text-foreground focus-visible:outline-none"
            onclick={(e) => e.stopPropagation()}
          >
            <Rows class="h-4 w-4" />
          </ToggleGroup.Item>
          
          <ToggleGroup.Item
            value="2"
            aria-label="Two columns"
            class="data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:border-r-2 data-[state=on]:border-primary
                  h-8 w-8 flex items-center justify-center 
                  text-muted-foreground hover:text-foreground focus-visible:outline-none"
            onclick={(e) => e.stopPropagation()}
          >
            <SquaresFour class="h-4 w-4" />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      
      <!-- Expand indicator -->
      <div class="text-center">
        <CaretDown class="h-3 w-3 text-muted-foreground mx-auto" />
      </div>
    </div>
  </div>
  
  <!-- Expanded state -->
  <div 
    class={cn(
      "bg-background rounded-2xl shadow-md border border-border transition-all duration-300",
      isExpanded ? "opacity-100" : "opacity-0 pointer-events-none absolute"
    )}
  >
    <div class="p-4 relative">
      <!-- Close button -->
      <button
        type="button"
        class="absolute top-3 right-3 p-1.5 rounded-sm text-muted-foreground hover:text-foreground 
               bg-muted/30 hover:bg-muted transition-colors"
        onclick={toggleExpanded}
        aria-label="Close sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Expanded content -->
      <div class="pt-2 space-y-6">
        <div>
          <h3 class="text-sm font-medium text-foreground mb-4">Layout</h3>
          <!-- Controls Section -->
          <LayoutControls 
            {sidebarMode}
            {columnCount}
            compact={false}
            onSidebarModeChange={(mode) => sidebarMode = mode}
            onColumnCountChange={(count) => columnCount = count}
          />
        </div>

        <div class="border-t border-border pt-4">
          <div class="flex items-center gap-2 mb-4">
            <Sliders class="h-4 w-4 text-primary" />
            <h3 class="text-sm font-medium text-foreground">Filters</h3>
          </div>
          
          <FilterControls 
            fomoThreshold={fomoScore}
            selectedTags={selectedTags}
            showOnlyActive={activeOnly}
            onFomoThresholdChange={handleFomoChange}
            onSelectedTagsChange={handleTagsChange}
            onShowOnlyActiveChange={handleActiveChange}
          />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Container styles based on screen size */
  .sidebar-container {
    position: relative;
    width: 3rem;
    z-index: 30;
  }

  /* Collapsed state */
  .sidebar-container > div:first-child {
    width: 3rem;
  }

  /* Expanded state */
  .sidebar-container > div:last-child {
    width: 280px;
    max-height: 80vh;
    overflow-y: auto;
  }

  /* Desktop layout - left side */
  @media (min-width: 768px) {
    .sidebar-container {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  /* Mobile layout - top */
  @media (max-width: 767px) {
    .sidebar-container {
      position: sticky;
      top: 1rem;
      margin-bottom: 1rem;
    }

    /* Expanded state for mobile */
    .sidebar-container > div:last-child {
      position: fixed;
      top: 1rem;
      left: 1rem;
      right: 1rem;
      width: auto;
    }
  }
</style>