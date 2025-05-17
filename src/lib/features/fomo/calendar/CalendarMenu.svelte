<!-- src/lib/features/fomo/calendar/CalendarMenu.svelte -->
<script lang="ts">
  import { X } from 'phosphor-svelte';
  import { createEventDispatcher } from 'svelte';
  import { today, getLocalTimeZone, parseDate, type DateValue } from "@internationalized/date";
  import RangeCalendar from './RangeCalendar.svelte';
  
  // Create event dispatcher for date range changes and closing
  const dispatch = createEventDispatcher<{
    dateRangeChange: { startDate: Date | null, endDate: Date | null };
    close: void;
  }>();
  
  // Props - receive dates directly instead of from context
  let { 
    isOpen = false,
    startDate = null,
    endDate = null 
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
  
  // Update calendar value when props change
  $effect(() => {
    if (isOpen) { // Only update when menu is open to avoid unnecessary updates
      calendarValue = {
        start: startDate ? parseDate(startDate.toISOString().split('T')[0]) : undefined,
        end: endDate ? parseDate(endDate.toISOString().split('T')[0]) : undefined
      };
    }
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
      const startDateObj = new Date(calendarValue.start.toString());
      const endDateObj = new Date(calendarValue.end.toString());
      dispatch('dateRangeChange', { startDate: startDateObj, endDate: endDateObj });
      dispatch('close');
    }
  }
  
  // Function to close the menu
  function closeMenu() {
    dispatch('close');
  }
  
  // Function to check if a date is in the future
  function isDateInFuture(date: DateValue): boolean {
    const todayDate = today(getLocalTimeZone());
    return date.compare(todayDate) > 0;
  }
</script>

{#if isOpen}
  <div 
    class="calendar-menu-container bg-background rounded-t-2xl shadow-lg z-20 animate-in slide-in-from-bottom-2 duration-500"
  >
    <!-- Header with title and close button -->
    <div class="flex items-center justify-between py-3 px-4">
      <h3 class="text-base font-medium text-foreground">Date Range</h3>
      <button 
        type="button" 
        class="p-1.5 text-muted-foreground hover:text-foreground rounded-default hover:bg-muted transition-colors"
        onclick={closeMenu}
        aria-label="Close"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
    
    <div class="p-4">
      <!-- Mobile layout: Presets in 2-column grid above calendar -->
      <div class="sm:hidden mb-4">
        <div class="text-foreground text-xs font-medium mb-2">Quick Select</div>
        <div class="grid grid-cols-2 gap-2">
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
      
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Calendar -->
        <div class="w-full sm:w-[280px]">
          <RangeCalendar 
            bind:value={calendarValue}
            on:rangeSelected={handleRangeSelected}
            isDateDisabled={isDateInFuture}
          />
        </div>
        
        <!-- Desktop layout: Date range controls on the side -->
        <div class="hidden sm:flex w-full sm:w-[140px] border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4 flex-col">
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

<style lang="css">
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
      position: fixed;
      bottom: 3.5rem; /* 14px (h-14) */
      left: 1rem;
      right: 1rem;
      width: auto;
      margin: 0 auto;
      max-width: calc(100% - 2rem);
    }
  }
</style>