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
          class="p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <CaretLeft size={16} />
        </button>
        
        <div class="text-sm font-medium text-foreground">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        
        <button 
          type="button"
          onclick={nextMonth}
          class="p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <CaretRight size={16} />
        </button>
      </div>
    {/snippet}
    
    {#snippet day({ date, isSelected, isRangeStart, isRangeEnd, isInRange, isDisabled, isOutsideMonth, isToday, isFocused })}
      <button
        type="button"
        disabled={isDisabled || isOutsideMonth}
        class="flex items-center justify-center w-8 h-8 text-xs
              text-foreground 
              {isToday ? 'bg-muted' : ''}
              {isOutsideMonth ? 'text-muted-foreground/50' : ''}
              {isSelected ? 'bg-primary text-primary-foreground' : ''}
              {isRangeStart ? 'bg-primary text-primary-foreground' : ''}
              {isRangeEnd ? 'bg-primary text-primary-foreground' : ''}
              {isInRange ? 'bg-primary/30' : ''}
              {isFocused ? 'ring-2 ring-primary/50' : ''}
              hover:bg-muted"
      >
        {date.day}
      </button>
    {/snippet}
  </Calendar.Root>
  
  <div class="text-xs text-muted-foreground">
    <div>Start: {formatDate(startDate)}</div>
    <div>End: {formatDate(endDate)}</div>
  </div>
</div>