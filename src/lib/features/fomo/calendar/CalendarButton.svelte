<!-- src/lib/features/fomo/calendar/CalendarButton.svelte -->
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  import { CalendarBlank, CaretLeft, CaretRight, X } from 'phosphor-svelte';
  import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
  import type { DateRange } from "bits-ui";
  
  // Create today's date to use as placeholder
  const todayDate = today(getLocalTimeZone());
  
  // State for date range
  let dateRange = $state<DateRange | null>(null);
  let isOpen = $state(false);
  
  // Format date for display
  function formatDate(date: CalendarDate | null): string {
    if (!date) return "Select date";
    
    return `${date.month}/${date.day}`;
  }
  
  // Display text for button
  const displayText = $derived(() => {
    if (!dateRange || !dateRange.start) return "All time";
    
    // If start equals end or no end, show single date
    if (dateRange.end && dateRange.start.compare(dateRange.end) === 0) {
      return formatDate(dateRange.start);
    } else if (!dateRange.end) {
      return formatDate(dateRange.start);
    }
    
    // Show range
    return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
  });
  
  // Clear selection
  function clearDate() {
    dateRange = null;
  }
</script>

<div class="relative z-50">
  <!-- Custom trigger button to replace DateRangePicker.Trigger -->
  <button 
    class="h-10 bg-zinc-800/80 border border-zinc-700/50 rounded-full
           flex items-center px-3 text-zinc-300 hover:bg-zinc-700/80 
           transition-colors group"
    onclick={() => isOpen = !isOpen}
  >
    <CalendarBlank class="h-4 w-4 mr-1.5 text-zinc-400 group-hover:text-zinc-300" />
    <span class="text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
      {displayText}
    </span>
    
    {#if dateRange}
      <button
        onclick={(e) => {
          e.stopPropagation(); 
          clearDate();
        }}
        class="ml-1.5 h-5 w-5 rounded-full bg-zinc-700/70 flex items-center justify-center
               text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
      >
        <X size={12} />
      </button>
    {/if}
  </button>
  
  <!-- Date picker popover -->
  {#if isOpen}
    <div 
      class="absolute bottom-12 left-0 z-50 bg-zinc-800/95 border border-zinc-700/50 
             rounded-lg shadow-lg p-3 backdrop-blur-sm"
    >
      <!-- Calendar header -->
      <div class="flex items-center justify-between mb-3">
        <button class="h-8 w-8 rounded-full flex items-center justify-center
                       bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
        >
          <CaretLeft size={16} />
        </button>
        
        <div class="text-sm font-medium text-zinc-300">
          May 2025
        </div>
        
        <button class="h-8 w-8 rounded-full flex items-center justify-center
                       bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
        >
          <CaretRight size={16} />
        </button>
      </div>
      
      <!-- Calendar grid -->
      <div class="mb-2">
        <div class="grid grid-cols-7 gap-1 mb-1">
          {#each ["M", "T", "W", "T", "F", "S", "S"] as day}
            <div class="text-center text-xs text-zinc-500">{day}</div>
          {/each}
        </div>
        
        <div class="grid grid-cols-7 gap-1">
          {#each Array(35) as _, i}
            {@const day = (i - 3 + 1)}
            {@const isCurrentMonth = day > 0 && day <= 31}
            {@const isToday = day === 2} <!-- Assuming today is the 2nd -->
            
            <button 
              class="w-8 h-8 flex items-center justify-center rounded-full text-xs
                     {isCurrentMonth ? 'text-zinc-300' : 'text-zinc-600'} 
                     {isToday ? 'bg-zinc-700/50 border border-zinc-600' : 'hover:bg-zinc-700/50'}"
              disabled={!isCurrentMonth}
            >
              {isCurrentMonth ? day : ''}
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex justify-between pt-2 border-t border-zinc-700/50">
        <button
          onclick={clearDate}
          class="text-xs text-zinc-400 hover:text-zinc-300"
        >
          Clear
        </button>
        
        <button
          onclick={() => isOpen = false}
          class="bg-violet-600/90 hover:bg-violet-600 text-white text-xs px-3 py-1.5 rounded transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  {/if}
</div>