<!-- src/lib/features/fomo/FomoApp.svelte -->
<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  
  // Components
  import ShareButton from '$lib/components/cta/share/ShareButton.svelte';
  import ShareModal from '$lib/components/cta/share/ShareModal.svelte';
  import CalendarButton from './calendar/CalendarButton.svelte';
  import CalendarMenu from './calendar/CalendarMenu.svelte';
  import FomoScoreButton from './score/FomoScoreButton.svelte';
  import FomoScoreMenu from './score/FomoScoreMenu.svelte';
  import { ArrowsOutSimple, ArrowsInSimple } from 'phosphor-svelte';
  
  // Local state for UI
  let isScoreMenuOpen = $state(false);
  let isCalendarMenuOpen = $state(false);
  let isShareModalOpen = $state(false);
  let isExpanded = $state(false);
  
  // Filter state - this is shared with NewsGrid component
  let fomoThreshold = $state(60);
  let startDate = $state<Date | null>(null);
  let endDate = $state<Date | null>(null);
  let selectedTags = $state<string[]>([]);
  
  // Analytics state
  let currentScore = $state(0);
  let articleCount = $state(0);
  let isLoading = $state(false);
  
  // Format dates for API
  const formatDateForApi = (date: Date | null) => {
    return date ? date.toISOString().split('T')[0] : undefined;
  };
  
  // Load aggregate data for FOMO score display
  async function loadFomoStats() {
    isLoading = true;
    
    try {
      // Get filtered news for analytics
      const result = await trpc().getNews.query({
        minScore: fomoThreshold,
        dateStart: formatDateForApi(startDate),
        dateEnd: formatDateForApi(endDate),
        tags: selectedTags.length > 0 ? selectedTags : undefined
      });
      
      // Calculate average score and item count
      articleCount = result.items.length;
      
      if (articleCount > 0) {
        const scoreSum = result.items.reduce((sum, item) => {
          const score = typeof item.fomo_score === 'number'
            ? item.fomo_score
            : parseInt(String(item.fomo_score), 10);
            
          return sum + (isNaN(score) ? 0 : score);
        }, 0);
        
        currentScore = Math.round(scoreSum / articleCount);
      } else {
        currentScore = 0;
      }
      
      console.log('FomoApp updated values:', { currentScore, articleCount, fomoThreshold });
    } catch (err) {
      console.error('Error loading FOMO stats:', err);
    } finally {
      isLoading = false;
    }
  }
  
  // Load initial data
  $effect(() => {
    loadFomoStats();
  });
  
  // Reload when filters change
  $effect(() => {
    // This will trigger when fomoThreshold, startDate, endDate, or selectedTags change
    loadFomoStats();
  });
  
  // Listen for filter changes from NewsGrid
  $effect(() => {
    function handleExternalThresholdChanged(e: CustomEvent) {
      if (e.detail?.fomoThreshold !== undefined && e.detail.fomoThreshold !== fomoThreshold) {
        fomoThreshold = e.detail.fomoThreshold;
      }
    }
    
    document.addEventListener('fomoThresholdChanged', handleExternalThresholdChanged as EventListener);
    
    return () => {
      document.removeEventListener('fomoThresholdChanged', handleExternalThresholdChanged as EventListener);
    };
  });
  
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
      // Convert DateValue to JavaScript Date and update
      startDate = new Date(start.toString());
      endDate = new Date(end.toString());
    } else {
      startDate = null;
      endDate = null;
    }
    
    // Close the calendar menu after selection
    isCalendarMenuOpen = false;
    
    // Notify other components
    broadcastFilterChange();
  }
  
  // Handle FOMO threshold change from menu
  function handleThresholdChange(value: number) {
    console.log("FomoApp: Threshold change requested to", value);
    
    if (fomoThreshold !== value) {
      fomoThreshold = value;
      
      // Notify other components
      broadcastFilterChange();
    }
    
    // Close the menu after threshold is applied
    isScoreMenuOpen = false;
  }
  
  // Notify other components of filter changes
  function broadcastFilterChange() {
    const changeEvent = new CustomEvent('filtersChanged', {
      detail: { 
        fomoThreshold, 
        startDate, 
        endDate, 
        selectedTags 
      },
      bubbles: true
    });
    
    document.dispatchEvent(changeEvent);
  }
  
  // Toggle expanded state
  function toggleExpanded() {
    isExpanded = !isExpanded;
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