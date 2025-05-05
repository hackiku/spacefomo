<!-- src/lib/features/fomo/calendar/CalendarContent.svelte -->
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { CaretLeft, CaretRight } from 'phosphor-svelte';
  import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
  
  // Initialize with today's date
  let placeholder = $state(today(getLocalTimeZone()));
  
  // Selected date ranges
  let startDate = $state<DateValue | null>(null);
  let endDate = $state<DateValue | null>(null);
  
  // Expose an event dispatcher for when selection changes
  let { onSelectionChange } = $props<{ 
    onSelectionChange?: (start: DateValue | null, end: DateValue | null) => void 
  }>();
  
  // Handle date selection
  function handleSelect(date: DateValue) {
    if (!startDate || (startDate && endDate)) {
      // Start a new selection
      startDate = date;
      endDate = null;
    } else {
      // Complete the selection
      if (date.compare(startDate) < 0) {
        endDate = startDate;
        startDate = date;
      } else {
        endDate = date;
      }
    }
    
    // Notify parent component if callback provided
    if (onSelectionChange) {
      onSelectionChange(startDate, endDate);
    }
  }
  
  // Format a date for display
  function formatDate(date: DateValue | null): string {
    if (!date) return 'Not selected';
    
    const jsDate = new Date(date.toString());
    return jsDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

<div class="space-y-4">
  <Calendar.Root
    bind:placeholder
    selectionMode="range"
    fixedWeeks={true}
    weekdayFormat="short"
    selected={startDate}
    rangeEnd={endDate}
    onDateSelect={handleSelect}
  >
    {#snippet header({ month, nextMonth, prevMonth })}
      <div class="flex items-center justify-between mb-4">
        <button 
          type="button"
          onclick={prevMonth}
          class="rounded-full p-2 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300"
        >
          <CaretLeft size={16} />
        </button>
        
        <div class="text-sm font-medium text-zinc-300">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        
        <button 
          type="button"
          onclick={nextMonth}
          class="rounded-full p-2 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300"
        >
          <CaretRight size={16} />
        </button>
      </div>
    {/snippet}
    
    {#snippet day({ date, isSelected, isRangeStart, isRangeEnd, isInRange, isDisabled, isOutsideMonth, isToday, isFocused })}
      <button
        type="button"
        disabled={isDisabled || isOutsideMonth}
        class="flex items-center justify-center w-8 h-8 rounded-full text-xs
              text-zinc-300 
              {isToday ? 'bg-zinc-700/50' : ''}
              {isOutsideMonth ? 'text-zinc-600' : ''}
              {isSelected ? 'bg-violet-600/90 text-white' : ''}
              {isRangeStart ? 'bg-violet-600 text-white' : ''}
              {isRangeEnd ? 'bg-violet-600 text-white' : ''}
              {isInRange ? 'bg-violet-600/30' : ''}
              {isFocused ? 'ring-2 ring-violet-500/50' : ''}
              hover:bg-zinc-700/50"
      >
        {date.day}
      </button>
    {/snippet}
  </Calendar.Root>
  
  <div class="text-xs text-zinc-400">
    <div>Start: {formatDate(startDate)}</div>
    <div>End: {formatDate(endDate)}</div>
  </div>
</div>