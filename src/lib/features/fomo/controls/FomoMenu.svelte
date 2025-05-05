<!-- src/lib/features/fomo/controls/FomoMenu.svelte -->
<script lang="ts">
  import { CalendarBlank, Clock, EyeClosed, Eye, ChartLine } from 'phosphor-svelte';
  import { createEventDispatcher } from 'svelte';
  import { Calendar } from "bits-ui";
  import { CaretLeft, CaretRight } from 'phosphor-svelte';
  import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
  
  // Create a dispatcher for events
  const dispatch = createEventDispatcher<{
    dateRangeChange: { startDate: DateValue | null, endDate: DateValue | null };
    toggleFomo: { visible: boolean };
  }>();
  
  // Calendar state
  let placeholder = $state(today(getLocalTimeZone()));
  let startDate = $state<DateValue | null>(null);
  let endDate = $state<DateValue | null>(null);
  
  // Menu state
  let isExpanded = $state(false);
  let showFomo = $state(true);
  let activeTab = $state<'calendar' | 'options'>('calendar');
  
  // Toggle menu expanded state
  function toggleMenu() {
    isExpanded = !isExpanded;
  }
  
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
  }
  
  // Toggle FOMO visibility
  function toggleFomoVisibility() {
    showFomo = !showFomo;
    dispatch('toggleFomo', { visible: showFomo });
  }
  
  // Apply the selected date range
  function applyDateRange() {
    dispatch('dateRangeChange', { startDate, endDate });
    isExpanded = false; // Close the menu
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
  
  // Set active tab
  function setTab(tab: 'calendar' | 'options') {
    activeTab = tab;
  }
</script>

<!-- Menu container with expand/collapse animations -->
<div 
  class="relative z-40"
  role="navigation"
  aria-label="FOMO controls"
>
  <!-- Button trigger -->
  <button
    type="button"
    onclick={toggleMenu}
    class="inline-flex items-center justify-center rounded-full 
          w-10 h-10
          bg-zinc-800 hover:bg-zinc-700 text-zinc-200
          transition-all hover:text-white active:scale-95"
    aria-label={isExpanded ? "Close FOMO menu" : "Open FOMO menu"}
    aria-expanded={isExpanded}
  >
    <CalendarBlank weight="bold" class="w-5 h-5" />
  </button>
  
  <!-- Expanded menu panel -->
  {#if isExpanded}
    <div 
      class="absolute bottom-full left-0 mb-2 p-4 w-[440px] 
             bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl
             animate-in slide-in-from-bottom-2 duration-150"
    >
      <!-- Tab navigation -->
      <div class="flex items-center mb-4 border-b border-zinc-700/50">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium transition-colors {activeTab === 'calendar' ? 'text-zinc-200 border-b-2 border-violet-500 -mb-px' : 'text-zinc-400 hover:text-zinc-300'}"
          onclick={() => setTab('calendar')}
        >
          Calendar
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium transition-colors {activeTab === 'options' ? 'text-zinc-200 border-b-2 border-violet-500 -mb-px' : 'text-zinc-400 hover:text-zinc-300'}"
          onclick={() => setTab('options')}
        >
          Options
        </button>
      </div>
      
      {#if activeTab === 'calendar'}
        <!-- Calendar tab content -->
        <div class="flex gap-4">
          <!-- Calendar -->
          <div class="w-[280px]">
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
          </div>
          
          <!-- Date range controls -->
          <div class="w-[120px] border-l border-zinc-700/30 pl-4 flex flex-col">
            <div class="text-zinc-300 text-xs font-medium mb-3 flex items-center">
              <Clock class="w-4 h-4 mr-1.5 text-zinc-400" />
              <span>Date Range</span>
            </div>
            
            <!-- Date display -->
            <div class="text-xs text-zinc-400 space-y-1 mb-4">
              <div>Start: {formatDate(startDate)}</div>
              <div>End: {formatDate(endDate)}</div>
            </div>
            
            <!-- Preset buttons -->
            <div class="space-y-2 mb-4">
              <button 
                type="button"
                class="w-full py-1 px-2 text-xs bg-zinc-700/50 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
                onclick={() => {
                  const now = today(getLocalTimeZone());
                  const weekAgo = now.subtract({ weeks: 1 });
                  startDate = weekAgo;
                  endDate = now;
                }}
              >
                Last Week
              </button>
              
              <button 
                type="button"
                class="w-full py-1 px-2 text-xs bg-zinc-700/50 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
                onclick={() => {
                  const now = today(getLocalTimeZone());
                  const monthAgo = now.subtract({ months: 1 });
                  startDate = monthAgo;
                  endDate = now;
                }}
              >
                Last Month
              </button>
            </div>
            
            <!-- Apply button -->
            <button
              class="w-full py-2 px-4 mt-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 
                     text-white rounded text-xs font-medium
                     transition-all hover:from-violet-600 hover:to-fuchsia-600"
              onclick={applyDateRange}
            >
              Apply Range
            </button>
          </div>
        </div>
      {:else}
        <!-- Options tab content -->
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-zinc-800 rounded-md border border-zinc-700/30">
            <div class="flex items-center gap-2">
              <ChartLine class="w-5 h-5 text-zinc-300" />
              <div>
                <div class="text-sm font-medium text-zinc-200">FOMO Score Display</div>
                <div class="text-xs text-zinc-400">Show or hide FOMO score visualization</div>
              </div>
            </div>
            
            <button 
              type="button"
              onclick={toggleFomoVisibility}
              class="inline-flex items-center justify-center p-2 rounded-md bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 transition-colors"
              aria-label={showFomo ? "Hide FOMO scores" : "Show FOMO scores"}
            >
              {#if showFomo}
                <Eye class="w-5 h-5" />
              {:else}
                <EyeClosed class="w-5 h-5" />
              {/if}
            </button>
          </div>
          
          <!-- Visualization Options (placeholder) -->
          <div class="p-3 bg-zinc-800 rounded-md border border-zinc-700/30">
            <div class="text-sm font-medium text-zinc-200 mb-2">Visualization Options</div>
            
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs text-zinc-300">
                <input type="radio" name="vis-type" checked class="accent-violet-500" />
                Bar Chart
              </label>
              
              <label class="flex items-center gap-2 text-xs text-zinc-300">
                <input type="radio" name="vis-type" class="accent-violet-500" />
                Line Graph
              </label>
              
              <label class="flex items-center gap-2 text-xs text-zinc-300">
                <input type="radio" name="vis-type" class="accent-violet-500" />
                Heat Map
              </label>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>