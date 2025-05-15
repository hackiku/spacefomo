<!-- src/lib/features/fomo/FomoApp.svelte (updated) -->
<script lang="ts">
  import { useFomo } from '$lib/context/fomoContext.svelte';
  import { getNewsContext } from '$lib/context/newsContext.svelte';
  import { parseDate, type DateValue } from "@internationalized/date";
  
  // Components
  import ShareButton from '$lib/components/cta/share/ShareButton.svelte';
  import ShareModal from '$lib/components/cta/share/ShareModal.svelte';
  import CalendarButton from './calendar/CalendarButton.svelte';
  import CalendarMenu from './calendar/CalendarMenu.svelte';
  import FomoScoreButton from './score/FomoScoreButton.svelte';
  import FomoScoreMenu from './score/FomoScoreMenu.svelte';
  import TimelineWrapper from './timeline/TimelineWrapper.svelte';
  import BarTimeline from './timeline/BarTimeline.svelte';
  import { ArrowsOutSimple, ArrowsInSimple } from 'phosphor-svelte';
  
  // Get contexts for data
  const fomo = useFomo();
  const news = getNewsContext();
  
  // App state
  let isExpanded = $state(false);
  let isScoreMenuOpen = $state(false);
  let isCalendarMenuOpen = $state(false);
  let isShareModalOpen = $state(false);
  let startDate = $state<Date | null>(null);
  let endDate = $state<Date | null>(null);
  let visualizationType = $state<'bar' | 'line' | 'heatmap'>('bar');
  let fomoThreshold = $state(50);
  
  // Toggle expanded state for timeline
  function toggleExpanded() {
    isExpanded = !isExpanded;
  }
  
  // Toggle score menu
  function toggleScoreMenu() {
    isScoreMenuOpen = !isScoreMenuOpen;
    if (isScoreMenuOpen) isCalendarMenuOpen = false;
  }
  
  // Toggle calendar menu
  function toggleCalendarMenu() {
    isCalendarMenuOpen = !isCalendarMenuOpen;
    if (isCalendarMenuOpen) isScoreMenuOpen = false;
  }
  
  // Open/close share modal
  function openShareModal() {
    isShareModalOpen = true;
  }
  
  function closeShareModal() {
    isShareModalOpen = false;
  }
  
  // Handle date range change
  function handleDateRangeChange(event) {
    const { startDate: start, endDate: end } = event.detail;
    
    if (start && end) {
      // Convert DateValue to JavaScript Date
      startDate = new Date(start.toString());
      endDate = new Date(end.toString());
    } else {
      resetDateFilter();
    }
    
    // Close the calendar menu after selection
    isCalendarMenuOpen = false;
  }
  
  // Reset the date filter
  function resetDateFilter() {
    startDate = null;
    endDate = null;
  }
  
  // Handle FOMO threshold change
  function handleThresholdChange(value: number) {
    fomoThreshold = value;
  }
  
  // Handle visualization type change
  function handleVisualizationChange(type: 'bar' | 'line' | 'heatmap') {
    visualizationType = type;
  }
  
  // Close menus when clicking outside
  function handleClickOutside(e: MouseEvent) {
    if (isScoreMenuOpen || isCalendarMenuOpen) {
      const target = e.target as Node;
      const controlBar = document.querySelector('.control-bar');
      
      if (controlBar && !controlBar.contains(target)) {
        isScoreMenuOpen = false;
        isCalendarMenuOpen = false;
      }
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div 
  class="transition-all duration-300"
  class:h-14={!isExpanded}
  class:h-64={isExpanded}
>
  <!-- Main container -->
  <div class="flex flex-col h-full">
    <!-- Control bar (always visible) -->
    <div class="control-bar flex items-center justify-between h-14 relative">
      <!-- Left section with controls -->
      <div class="flex items-center gap-3">
        
        <!-- FOMO Score with menu -->
        <div class="relative">
          <FomoScoreButton score={44} onClick={toggleScoreMenu} />
          <FomoScoreMenu 
            isOpen={isScoreMenuOpen} 
            score={44}
            threshold={fomoThreshold}
            onThresholdChange={handleThresholdChange}
          />
        </div>
        
        <!-- Date range button with menu -->
        <div class="relative mb-2">
          <CalendarButton 
            {startDate}
            {endDate}
            onClick={toggleCalendarMenu}
          />
          
          <CalendarMenu 
            isOpen={isCalendarMenuOpen}
            {startDate}
            {endDate}
            on:dateRangeChange={handleDateRangeChange}
            on:close={() => isCalendarMenuOpen = false}
          />
        </div>
      </div>
      
      <!-- Right section with buttons -->
      <div class="flex items-center gap-2">
        <!-- Share Button -->
        <ShareButton variant="icon" size="sm" onClick={openShareModal} />
        
        <!-- Expand/collapse button -->
        <button
          type="button"
          class="inline-flex items-center justify-center p-2
                 bg-primary/10 hover:bg-primary/20 text-muted-foreground hover:text-foreground
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
    </div>
    
    <!-- Timeline (expanded when isExpanded is true) -->
    <TimelineWrapper {isExpanded}>
      {#if visualizationType === 'bar'}
        <BarTimeline />
      {:else if visualizationType === 'line'}
        <div class="w-full h-full flex items-center justify-center">
          <p class="text-muted-foreground">Line visualization coming soon</p>
        </div>
      {:else}
        <div class="w-full h-full flex items-center justify-center">
          <p class="text-muted-foreground">Heatmap visualization coming soon</p>
        </div>
      {/if}
    </TimelineWrapper>
  </div>
</div>

<!-- Share Modal (conditionally rendered when open) -->
{#if isShareModalOpen}
  <ShareModal onClose={closeShareModal} />
{/if}