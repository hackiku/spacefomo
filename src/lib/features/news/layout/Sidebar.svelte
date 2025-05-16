<!-- src/lib/features/news/layout/Sidebar.svelte -->
<script lang="ts">
  import { cn } from '$lib/utils';
  import { getFomoContext } from '$lib/context/fomoContext.svelte';
  import LayoutControls from '../controls/LayoutControls.svelte'; 
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import { Sliders, CaretDown, CaretUp, ArrowsInLineHorizontal, Columns, Table, Rows, SquaresFour, X } from 'phosphor-svelte';
  import { ToggleGroup } from "bits-ui";

  // Get FOMO context for filter controls
  const fomoContext = getFomoContext();

  // Bindable props
  let { 
    sidebarMode = $bindable<SidebarMode>('default'),
    columnCount = $bindable<ColumnCount>(1)
  } = $props();

  // State
  let isExpanded = $state(false);
  
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
  
  // Handle FOMO threshold change
  function handleFomoChange(value: number) {
    fomoContext.setFomoThreshold(value);
  }
  
  // Handle tag selection change
  function handleTagsChange(tags: string[]) {
    fomoContext.setSelectedTags(tags);
  }
  
  // Get all available tags for filtering
  const availableTags = $derived(() => {
    const allTags = new Set<string>();
    const newsItems = fomoContext.filteredItems;
    
    newsItems.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    return Array.from(allTags).sort();
  });
</script>

<div class="sidebar-container">
  <!-- Collapsed sidebar control -->
  <div 
    class="rounded-2xl bg-background border border-border shadow-md overflow-hidden cursor-pointer"
    class:hidden={isExpanded}
    onclick={toggleExpanded}
  >
    <!-- Layout Controls Preview -->
    <div class="p-3 space-y-3 min-w-[54px]">
      <!-- Layout Toggle Group -->
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

      <!-- Column Toggle Group -->
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
      
      <div class="mt-2 text-center">
        <CaretDown class="h-3 w-3 text-muted-foreground mx-auto" />
      </div>
    </div>
  </div>
  
  <!-- Expanded sidebar panel -->
  <div 
    class={cn(
      "fixed z-40 rounded-2xl bg-background border border-border shadow-md transition-all duration-300",
      isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
    )}
    style="
      width: 280px;
      max-height: 80vh;
      overflow-y: auto;
    "
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
        <X class="w-4 h-4" />
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
          
          <!-- FOMO Threshold Filter -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between">
              <label for="fomo-slider" class="text-sm text-muted-foreground">
                FOMO Threshold: {fomoContext.fomoThreshold}
              </label>
              <span class="text-primary font-medium text-sm">
                {fomoContext.articleCount} articles
              </span>
            </div>
            
            <input
              id="fomo-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={fomoContext.fomoThreshold}
              oninput={(e) => handleFomoChange(parseInt(e.currentTarget.value))}
              class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          
          <!-- Tags Filter -->
          {#if availableTags.length > 0}
            <div class="space-y-3">
              <h4 class="text-sm text-muted-foreground">Tags</h4>
              <div class="flex flex-wrap gap-2">
                {#each availableTags.slice(0, 15) as tag}
                  <button
                    type="button"
                    class={cn(
                      "px-2 py-1 text-xs rounded-sm transition-colors",
                      fomoContext.selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                    onclick={() => {
                      const newTags = fomoContext.selectedTags.includes(tag)
                        ? fomoContext.selectedTags.filter(t => t !== tag)
                        : [...fomoContext.selectedTags, tag];
                      
                      handleTagsChange(newTags);
                    }}
                  >
                    {tag}
                  </button>
                {/each}
                
                {#if fomoContext.selectedTags.length > 0}
                  <button
                    type="button"
                    class="px-2 py-1 text-xs rounded-sm bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    onclick={() => handleTagsChange([])}
                  >
                    Clear All
                  </button>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Container styles based on screen size */
  .sidebar-container {
    position: relative;
    z-index: 30;
  }

  /* Desktop layout - left side */
  @media (min-width: 768px) {
    .sidebar-container {
      position: absolute;
      left: 0;
      top: 0;
    }
    
    /* Expanded state */
    .sidebar-container > div:last-child {
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
      top: 1rem;
      left: 1rem;
      right: 1rem;
      width: auto;
    }
  }
</style>