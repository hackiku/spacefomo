<!-- src/lib/features/news/layout/SidebarToggle.svelte -->
<script lang="ts">
  import { Button } from "bits-ui";
  import Sidebar from './Sidebar.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import { X, List, CaretDown, ArrowsInLineHorizontal, Columns, Table, Rows, SquaresFour } from 'phosphor-svelte';
  import { ToggleGroup } from "bits-ui";

  // Props for sidebar configuration
  let { 
    sidebarMode = $bindable<SidebarMode>(),
    columnCount = $bindable<ColumnCount>()
  } = $props();

  // State for sidebar visibility
  let isExpanded = $state(false);
  
  // Toggle sidebar visibility
  function toggleSidebar() {
    isExpanded = !isExpanded;
  }
  
  // Handle layout toggle changes
  function handleLayoutChange(layout: string | string[]) {
    if (typeof layout === 'string') {
      sidebarMode = layout as SidebarMode;
    }
  }

  // Handle column toggle changes
  function handleColumnChange(columns: string | string[]) {
    if (typeof columns === 'string') {
      columnCount = Number(columns) as ColumnCount;
    }
  }
</script>

<!-- Sidebar control container -->
<div class="stick-right-container">
  <!-- Collapsed preview - flush with right edge -->
  <div 
    class="relative rounded-2xl bg-background shadow-md
           cursor-pointer overflow-hidden transition-all duration-200"
    class:expanded={isExpanded}
    onclick={toggleSidebar}
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
</div>

<!-- Expanded Sidebar (only loads on demand) -->
{#if isExpanded}
  <div class="fixed inset-0 z-40 flex items-start justify-end">
    <!-- Backdrop (mobile only) -->
    <div 
      class="absolute inset-0 bg-background/80 backdrop-blur-sm md:hidden"
      onclick={toggleSidebar}
    ></div>
    
    <!-- Sidebar container with close button -->
    <div class="relative z-10 h-full max-h-screen w-full max-w-xs md:max-w-sm bg-card border-l border-border overflow-auto">
      <div class="sticky top-0 flex items-center justify-between p-3 z-10">
        <h2 class="text-base font-medium text-foreground">Layout & Filters</h2>
        <Button.Root
          onclick={toggleSidebar}
          class="group relative flex items-center justify-center h-8 w-8 
                bg-muted text-muted-foreground hover:text-foreground
                before:absolute before:inset-0
                before:border before:border-primary/0
                before:translate-x-0.5 before:translate-y-0.5
                before:transition-transform before:duration-300
                hover:before:border-primary/10
                hover:before:translate-x-0 hover:before:translate-y-0"
          aria-label="Close sidebar"
        >
          <X weight="bold" size={16} />
        </Button.Root>
      </div>
      
      <!-- Sidebar content -->
      <div class="p-4">
        <Sidebar
          {sidebarMode}
          {columnCount}
          compact={false}
          onSidebarModeChange={(mode) => sidebarMode = mode}
          onColumnCountChange={(count) => columnCount = count}
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .stick-right-container {
    position: sticky;
    top: 4rem;
    right: 0;
    float: right;
    height: 0;
    z-index: 30;
    margin-right: -3px;
  }
  
  .expanded {
    background-color: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
    pointer-events: none;
  }
  
  .expanded > * {
    opacity: 0;
  }
</style>