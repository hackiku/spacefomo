<!-- src/lib/features/fomo/FomoApp.svelte -->
<script lang="ts">
  import { useFomo } from '$lib/hooks/useFomo.svelte';
  import { parseDate, type DateValue } from "@internationalized/date";
  
  // Components
  import ShareButton from '$lib/components/cta/share/ShareButton.svelte';
  import ShareModal from '$lib/components/cta/share/ShareModal.svelte';
  import CalendarButton from './calendar/CalendarButton.svelte';
  import CalendarMenu from './calendar/CalendarMenu.svelte';
  import FomoScoreButton from './score/FomoScoreButton.svelte';
  import FomoScoreMenu from './score/FomoScoreMenu.svelte';
  import { ArrowsOutSimple, ArrowsInSimple } from 'phosphor-svelte';
  
  // Get context data via hook
  const {
    fomoThreshold, 
    startDate, 
    endDate,
    isExpanded,
    setFomoThreshold,
    setDateRange,
    toggleExpanded,
    currentScore,
    articleCount
  } = useFomo();
  
  // Local UI state that doesn't need to be shared
  let isScoreMenuOpen = $state(false);
  let isCalendarMenuOpen = $state(false);
  let isShareModalOpen = $state(false);
  
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
      // Convert DateValue to JavaScript Date and update context
      const startDateObj = new Date(start.toString());
      const endDateObj = new Date(end.toString());
      setDateRange(startDateObj, endDateObj);
    } else {
      setDateRange(null, null);
    }
    
    // Close the calendar menu after selection
    isCalendarMenuOpen = false;
  }
  
  // Handle FOMO threshold change
  function handleThresholdChange(value: number) {
    setFomoThreshold(value);
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
          <FomoScoreButton score={currentScore} onClick={toggleScoreMenu} />
          <FomoScoreMenu 
            isOpen={isScoreMenuOpen} 
            score={currentScore}
            articleCount={articleCount}
            threshold={fomoThreshold}
            onThresholdChange={handleThresholdChange}
          />
        </div>
        
        <!-- Date range button with menu -->
        <div class="relative">
          <CalendarButton 
            startDate={startDate}
            endDate={endDate}
            onClick={toggleCalendarMenu}
          />
          
          <CalendarMenu 
            isOpen={isCalendarMenuOpen}
            startDate={startDate}
            endDate={endDate}
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
    
  </div>
</div>

<!-- Share Modal (conditionally rendered when open) -->
{#if isShareModalOpen}
  <ShareModal onClose={closeShareModal} />
{/if}