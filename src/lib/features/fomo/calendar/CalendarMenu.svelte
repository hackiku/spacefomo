<!-- src/lib/features/fomo/calendar/CalendarMenu.svelte -->
<script lang="ts">
  import { Clock } from 'phosphor-svelte';
  import { createEventDispatcher } from 'svelte';
  import { today, getLocalTimeZone, parseDate, type DateValue } from "@internationalized/date";
  import RangeCalendar from './RangeCalendar.svelte';
  
  // Create event dispatcher
  const dispatch = createEventDispatcher<{
    dateRangeChange: { startDate: DateValue | null, endDate: DateValue | null };
    close: void;
  }>();
  
  // Props
  let { 
    isOpen = false,
    startDate = null, 
    endDate = null,
  } = $props<{
    isOpen: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
  }>();
  
  // Calendar state
  let calendarValue = $state<{ start: DateValue | undefined, end: DateValue | undefined }>({
    start: startDate ? parseDate(startDate.toISOString().split('T')[0]) : undefined,
    end: endDate ? parseDate(endDate.toISOString().split('T')[0]) : undefined
  });
  
  // Define presets with their actions
  const presets = [
    { 
      label: 'Today', 
      action: () => {
        const nowDate = today(getLocalTimeZone());
        calendarValue = { start: nowDate, end: nowDate };
        applySelection();
      }
    },
    { 
      label: 'Yesterday', 
      action: () => {
        const nowDate = today(getLocalTimeZone());
        const yesterdayDate = nowDate.subtract({ days: 1 });
        calendarValue = { start: yesterdayDate, end: yesterdayDate };
        applySelection();
      }
    },
    { 
      label: 'Last 7 Days', 
      action: () => {
        const nowDate = today(getLocalTimeZone());
        const weekAgo = nowDate.subtract({ days: 6 });
        calendarValue = { start: weekAgo, end: nowDate };
        applySelection();
      }
    },
    { 
      label: 'This Month', 
      action: () => {
        const nowDate = today(getLocalTimeZone());
        const firstOfMonth = nowDate.set({ day: 1 });
        calendarValue = { start: firstOfMonth, end: nowDate };
        applySelection();
      }
    },
    { 
      label: 'Last Month', 
      action: () => {
        const nowDate = today(getLocalTimeZone());
        const monthAgo = nowDate.subtract({ months: 1 });
        calendarValue = { start: monthAgo, end: nowDate };
        applySelection();
      }
    },
    { 
      label: 'All Time', 
      action: () => {
        calendarValue = { start: undefined, end: undefined };
        dispatch('dateRangeChange', { startDate: null, endDate: null });
        dispatch('close');
      }
    }
  ];
  
  // Handle calendar selection (immediately apply when selection changes)
  function handleRangeSelected(event) {
    const { start, end } = event.detail;
    calendarValue = { start, end };
    
    // If both start and end are selected, apply the selection
    if (start && end) {
      applySelection();
    }
  }
  
  // Apply the current selection
  function applySelection() {
    if (calendarValue.start && calendarValue.end) {
      dispatch('dateRangeChange', {
        startDate: calendarValue.start,
        endDate: calendarValue.end
      });
    }
  }
  
  // Format date for display
  function formatDate(date: DateValue | undefined): string {
    if (!date) return 'Not selected';
    
    const jsDate = new Date(date.toString());
    return jsDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

{#if isOpen}
  <div 
    class="bg-background rounded-t-2xl animate-in slide-in-from-bottom-2 duration-800 z-20 calendar-menu-container"
  >
    <div class="p-4">
      <h3 class="text-base font-medium text-foreground mb-3">Date Range</h3>
      
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Calendar -->
        <div class="w-full md:w-[280px]">
          <RangeCalendar 
            bind:value={calendarValue}
            on:rangeSelected={handleRangeSelected}
          />
        </div>
        
        <!-- Date range controls -->
        <div class="w-full md:w-[140px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4 flex flex-col">
          <!-- Date display -->
          <div class="text-foreground text-xs font-medium mb-2 flex items-center">
            <Clock class="w-4 h-4 mr-1.5 text-muted-foreground" />
            <span>Selection</span>
          </div>
          
          <div class="text-xs text-muted-foreground space-y-1 mb-4">
            <div>Start: {formatDate(calendarValue.start)}</div>
            <div>End: {formatDate(calendarValue.end)}</div>
          </div>
          
          <!-- Preset buttons -->
          <div class="text-foreground text-xs font-medium mb-2">Quick Select</div>
          <div class="space-y-2">
            {#each presets as preset}
              <button 
                type="button"
                class="w-full py-1.5 px-2 text-xs bg-muted hover:bg-muted/80 rounded-default text-muted-foreground hover:text-foreground transition-colors"
                onclick={preset.action}
              >
                {preset.label}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Mobile-friendly container */
  .calendar-menu-container {
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-bottom: 0.5rem;
    width: 440px;
  }

  /* For mobile screens */
  @media (max-width: 640px) {
    .calendar-menu-container {
      width: calc(100vw - 2rem);
      max-width: 440px;
    }
  }
</style>