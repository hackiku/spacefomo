<!-- src/lib/features/news/NewsApp.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { useUi } from '$lib/context/uiContext.svelte';
  import NewsGrid from './layout/NewsGrid.svelte';
  import Sidebar from './layout/Sidebar.svelte';
  import FomoApp from '$lib/features/fomo/FomoApp.svelte';
  import { cn } from '$lib/utils';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import type { NewsItem } from '$lib/types/news';

  // Get UI context
  const uiContext = useUi();
  
  // State for layout configuration - local component state
  let sidebarMode = $state<SidebarMode>('default');
  let columnCount = $state<ColumnCount>(1);
  
  // News state to be passed to NewsGrid
  let newsItems = $state<NewsItem[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let totalCount = $state(0);
  let offset = $state(0);
  let limit = $state(3); // Smaller for testing pagination
  
  // Filter state
  let fomoThreshold = $state(60);
  let startDate = $state<Date | null>(null);
  let endDate = $state<Date | null>(null);
  let selectedTags = $state<string[]>([]);

  // Initialize scroll listener
  let cleanup: (() => void) | null = null;
  
  onMount(() => {
    if (browser) {
      cleanup = uiContext.initScrollListener();
    }
  });
  
  onDestroy(() => {
    if (cleanup) cleanup();
  });

  // Sync layout state with UI context
  $effect(() => {
    uiContext.setSidebarMode(sidebarMode);
    uiContext.setColumnCount(columnCount);
  });

  // Track when sidebar mode or column count changes
  $effect(() => {
    console.log('Layout updated:', { sidebarMode, columnCount });
  });

  // Get container classes based on layout mode
  const getContainerClasses = $derived(() => {
    if (sidebarMode === 'thin') {
      return 'max-w-lg'; // Narrower content
    } else if (sidebarMode === 'wide') {
      return 'max-w-4xl'; // Wider content
    } else {
      return 'max-w-xl'; // Default width
    }
  });
  
  // Handle and relay filter changes from components
  function handleFilterChange({
    threshold = fomoThreshold,
    start = startDate,
    end = endDate,
    tags = selectedTags
  }) {
    fomoThreshold = threshold;
    startDate = start;
    endDate = end;
    selectedTags = tags;
  }
</script>

<div class="relative min-h-[calc(100vh-4rem)]">
  <!-- Main container with grid layout for desktop -->
  <div class="sticky top-16 z-10">
    <Sidebar 
      {sidebarMode} 
      {columnCount}
      {fomoThreshold}
      {selectedTags}
      onSidebarModeChange={(mode) => sidebarMode = mode}
      onColumnCountChange={(count) => columnCount = count}
      onFomoThresholdChange={(val) => handleFilterChange({threshold: val})}
      onTagsChange={(tags) => handleFilterChange({tags})}
    />
  </div>
  
  <div class="container mx-auto px-4 pb-20 sm:px-6 md:pl-16">
    <!-- Content wrapper -->
    <div class="mx-auto {getContainerClasses()} md:pt-0">
      <!-- Grid is content-agnostic, just displays the news -->
      <NewsGrid 
        {columnCount}
        {sidebarMode}
        {fomoThreshold}
        {startDate}
        {endDate}
        {selectedTags}
        {isLoading}
        {error}
        {newsItems}
        {totalCount}
        {offset}
        {limit}
        onFilterChange={handleFilterChange}
        onDataLoaded={(data) => {
          newsItems = data.items;
          totalCount = data.totalCount;
          isLoading = false;
          error = null;
        }}
        onError={(err) => {
          error = err;
          isLoading = false;
        }}
        onLoadingChange={(loading) => isLoading = loading}
      />
    </div>
  </div>

  <!-- Bottom FOMO App - fixed at bottom with scroll-based visibility -->
  <div 
    class={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background",
      "transition-transform duration-300 ease-in-out",
      (uiContext.isBottomHidden || uiContext.isNearFooter) ? "translate-y-full" : "translate-y-0"
    )}
  >
    <div class="w-full px-4 md:px-8 lg:px-12 xl:px-16">
      <FomoApp 
        {fomoThreshold}
        {startDate}
        {endDate}
        {selectedTags}
        onThresholdChange={(val) => handleFilterChange({threshold: val})}
        onDateRangeChange={(start, end) => handleFilterChange({start, end})}
      />
    </div>
  </div>
</div>