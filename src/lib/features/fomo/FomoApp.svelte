<!-- src/lib/features/fomo/FomoApp.svelte -->
<script lang="ts">
  import { useFomo } from '$lib/context/fomoContext.svelte';
  import { getNewsContext } from '$lib/context/newsContext.svelte';
  import { parseDate, type DateValue } from "@internationalized/date";
  
  import CalendarButton from './calendar/CalendarButton.svelte';
  import FomoMenu from './controls/FomoMenu.svelte';
  import TimelineWrapper from './timeline/TimelineWrapper.svelte';
  import BarTimeline from './timeline/BarTimeline.svelte';
  import { ChartLine, ArrowsOutSimple, ArrowsInSimple } from 'phosphor-svelte';
  
  // Get contexts for data
  const fomo = useFomo();
  const news = getNewsContext();
  
  // App state
  let isExpanded = $state(false);
  let isMenuOpen = $state(false);
  let startDate = $state<Date | null>(null);
  let endDate = $state<Date | null>(null);
  let visualizationType = $state<'bar' | 'line' | 'heatmap'>('bar');
  let isFilterActive = $state(false);
  
  // Toggle expanded state
  function toggleExpanded() {
    isExpanded = !isExpanded;
  }
  
  // Toggle menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // Handle date range change
  function handleDateRangeChange(event) {
    const { startDate: start, endDate: end } = event.detail;
    
    if (start && end) {
      // Convert DateValue to JavaScript Date
      startDate = new Date(start.toString());
      endDate = new Date(end.toString());
      isFilterActive = true;
      
      // Apply filters to news
      applyDateFilter(startDate, endDate);
    } else {
      resetDateFilter();
    }
  }
  
  // Apply date filter to news items
  function applyDateFilter(start, end) {
    if (!news || !news.items) return;
    
    if (!start || !end) {
      // Reset filtering
      isFilterActive = false;
      return;
    }
    
    isFilterActive = true;
    
    // Log filtering action (in real app, you would update the UI with filtered news)
    console.log(`Filtering news between ${start.toLocaleDateString()} and ${end.toLocaleDateString()}`);
    console.log(`Found ${news.items.length} total items`);
    
    // Example of how to filter news items by date
    const filteredItems = news.items.filter(item => {
      const itemDate = item.publication_date 
        ? (item.publication_date instanceof Date ? item.publication_date : new Date(item.publication_date))
        : null;
        
      // Skip items without dates
      if (!itemDate) return false;
      
      return itemDate >= start && itemDate <= end;
    });
    
    console.log(`Filtered to ${filteredItems.length} items in date range`);
    
    // Here you would update your news display or dispatch an event to notify parent components
  }
  
  // Reset the date filter
  function resetDateFilter() {
    startDate = null;
    endDate = null;
    isFilterActive = false;
    applyDateFilter(null, null);
  }
  
  // Handle visualization type change
  function handleVisualizationChange(event) {
    const { type } = event.detail;
    visualizationType = type;
  }
</script>

<div 
  class="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
  class:h-14={!isExpanded}
  class:h-64={isExpanded}
>
  <!-- Main container -->
  <div class="flex flex-col h-full border-t bg-background border-zinc-800/70 __bg-zinc-900/95 backdrop-blur-lg">
    <!-- Control bar (always visible) -->
    <div class="flex items-center justify-between h-14 px-4">
      <!-- Left section with fomo score -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5">
          <ChartLine weight="bold" class="w-5 h-5 text-violet-400" />
          <span class="text-sm font-medium text-zinc-200">
            FOMO
            <!-- {#if fomo.currentWeek} -->
              <!-- <span class="ml-1 text-lg font-semibold text-violet-400">{fomo.currentWeek.score}</span> -->
              <span class="ml-1 text-lg font-semibold text-violet-400">44</span>
            <!-- {/if} -->
          </span>
        </div>
        
        <!-- Date range button -->
        <div class="relative">
          <CalendarButton 
            {startDate}
            {endDate}
            onClick={toggleMenu}
          />
          
          <!-- Floating menu -->
          <FomoMenu 
            isOpen={isMenuOpen}
            {startDate}
            {endDate}
            {visualizationType}
            on:dateRangeChange={handleDateRangeChange}
            on:visualizationChange={handleVisualizationChange}
            on:close={() => isMenuOpen = false}
          />
        </div>
      </div>
      
      <!-- Right section with expand/collapse button -->
      <button
        type="button"
        class="inline-flex items-center justify-center p-2 rounded-full 
               bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300
               transition-colors"
        onclick={toggleExpanded}
        aria-label={isExpanded ? "Collapse FOMO timeline" : "Expand FOMO timeline"}
      >
        {#if isExpanded}
          <ArrowsInSimple class="w-5 h-5" />
        {:else}
          <ArrowsOutSimple class="w-5 h-5" />
        {/if}
      </button>
    </div>
    
    <!-- Timeline (expanded when isExpanded is true) -->
    <TimelineWrapper {isExpanded}>
      <!-- We'll conditionally render different timeline visualizations based on visualizationType -->
      {#if visualizationType === 'bar'}
        <BarTimeline />
      {:else if visualizationType === 'line'}
        <!-- D3Timeline will be implemented later -->
        <div class="w-full h-full flex items-center justify-center">
          <p class="text-zinc-500">Line visualization coming soon</p>
        </div>
      {:else}
        <div class="w-full h-full flex items-center justify-center">
          <p class="text-zinc-500">Heatmap visualization coming soon</p>
        </div>
      {/if}
    </TimelineWrapper>
  </div>
</div>