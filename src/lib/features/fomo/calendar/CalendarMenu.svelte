<!-- src/lib/features/fomo/controls/FomoMenu.svelte -->
<script lang="ts">
  import { Tabs } from "bits-ui";
  import { Clock, ChartLine, CalendarBlank } from 'phosphor-svelte';
  import { createEventDispatcher } from 'svelte';
  import { today, getLocalTimeZone, parseDate, type DateValue } from "@internationalized/date";
  
  import RangeCalendar from './RangeCalendar.svelte';
  import VisualizationOptions from '../timeline/VisualizationOptions.svelte';
  
  // Create event dispatcher
  const dispatch = createEventDispatcher<{
    dateRangeChange: { startDate: DateValue | null, endDate: DateValue | null };
    visualizationChange: { type: 'bar' | 'line' | 'heatmap' };
    close: void;
  }>();
  
  // Props
  let { 
    isOpen = false,
    startDate = null, 
    endDate = null,
    visualizationType = 'bar'
  } = $props<{
    isOpen: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
    visualizationType?: 'bar' | 'line' | 'heatmap';
  }>();
  
  // Calendar state
  let calendarValue = $state<{ start: DateValue | undefined, end: DateValue | undefined }>({
    start: startDate ? parseDate(startDate.toISOString().split('T')[0]) : undefined,
    end: endDate ? parseDate(endDate.toISOString().split('T')[0]) : undefined
  });
  
  // Active tab
  let activeTab = $state<string>('calendar');
  
  // Apply the selected date range
  function applyDateRange() {
    if (calendarValue.start && calendarValue.end) {
      dispatch('dateRangeChange', {
        startDate: calendarValue.start,
        endDate: calendarValue.end
      });
    }
    dispatch('close');
  }
  
  // Handle calendar selection
  function handleRangeSelected(event) {
    const { start, end } = event.detail;
    calendarValue = { start, end };
  }
  
  // Handle visualization change
  function handleVisualizationChange(event) {
    const { view } = event.detail;
    dispatch('visualizationChange', { type: view });
  }
  
  // Handle preset selections
  function selectLastWeek() {
    const now = today(getLocalTimeZone());
    const weekAgo = now.subtract({ weeks: 1 });
    calendarValue = { start: weekAgo, end: now };
  }
  
  function selectLastMonth() {
    const now = today(getLocalTimeZone());
    const monthAgo = now.subtract({ months: 1 });
    calendarValue = { start: monthAgo, end: now };
  }
  
  function selectAllTime() {
    calendarValue = { start: undefined, end: undefined };
    dispatch('dateRangeChange', { startDate: null, endDate: null });
    dispatch('close');
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
    class="absolute bottom-full left-0 mb-2 w-[440px] z-50
          bg-card border border-border rounded-default shadow-xl
          animate-in slide-in-from-bottom-2 duration-150"
  >
    <Tabs.Root 
      value={activeTab} 
      onValueChange={(val) => activeTab = val}
      class="p-4"
    >
      <Tabs.List class="flex items-center mb-4 border-b border-border">
        <Tabs.Trigger
          value="calendar"
          class="px-4 py-2 text-sm font-medium transition-colors data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:-mb-px data-[state=inactive]:hover:text-foreground"
        >
          Calendar
        </Tabs.Trigger>
        <Tabs.Trigger
          value="options"
          class="px-4 py-2 text-sm font-medium transition-colors data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:-mb-px data-[state=inactive]:hover:text-foreground"
        >
          Options
        </Tabs.Trigger>
      </Tabs.List>
      
      <Tabs.Content value="calendar" class="outline-none">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Calendar -->
          <div class="w-full md:w-[280px]">
            <RangeCalendar 
              bind:value={calendarValue}
              on:rangeSelected={handleRangeSelected}
            />
          </div>
          
          <!-- Date range controls -->
          <div class="w-full md:w-[120px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4 flex flex-col">
            <div class="text-foreground text-xs font-medium mb-3 flex items-center">
              <Clock class="w-4 h-4 mr-1.5 text-muted-foreground" />
              <span>Date Range</span>
            </div>
            
            <!-- Date display -->
            <div class="text-xs text-muted-foreground space-y-1 mb-4">
              <div>Start: {formatDate(calendarValue.start)}</div>
              <div>End: {formatDate(calendarValue.end)}</div>
            </div>
            
            <!-- Preset buttons -->
            <div class="space-y-2 mb-4">
              <button 
                type="button"
                class="w-full py-1 px-2 text-xs bg-muted hover:bg-muted/80 rounded-default text-muted-foreground hover:text-foreground transition-colors"
                on:click={selectLastWeek}
              >
                Last Week
              </button>
              
              <button 
                type="button"
                class="w-full py-1 px-2 text-xs bg-muted hover:bg-muted/80 rounded-default text-muted-foreground hover:text-foreground transition-colors"
                on:click={selectLastMonth}
              >
                Last Month
              </button>
              
              <button 
                type="button"
                class="w-full py-1 px-2 text-xs bg-muted hover:bg-muted/80 rounded-default text-muted-foreground hover:text-foreground transition-colors"
                on:click={selectAllTime}
              >
                All Time
              </button>
            </div>
            
            <!-- Apply button -->
            <button
              class="w-full py-2 px-4 mt-auto bg-space-gradient
                   text-primary-foreground rounded-default text-xs font-medium
                   transition-all hover:opacity-90"
              on:click={applyDateRange}
            >
              Apply Range
            </button>
          </div>
        </div>
      </Tabs.Content>
      
      <Tabs.Content value="options" class="outline-none">
        <div class="space-y-4">
          <!-- Visualization Type -->
          <div class="space-y-2">
            <h3 class="text-sm font-medium text-foreground">Visualization Type</h3>
            <VisualizationOptions 
              bind:activeView={visualizationType}
              onchange={handleVisualizationChange}
            />
          </div>
          
          <!-- Other options can be added here -->
          <div class="p-3 bg-muted rounded-default border border-border">
            <div class="flex items-center gap-2">
              <ChartLine class="w-5 h-5 text-foreground" />
              <div>
                <div class="text-sm font-medium text-foreground">Timeline Options</div>
                <div class="text-xs text-muted-foreground">Visualization settings</div>
              </div>
            </div>
            
            <div class="mt-3 space-y-2">
              <label class="flex items-center justify-between text-xs text-muted-foreground">
                <span>Show averages</span>
                <input type="checkbox" class="accent-primary" />
              </label>
              
              <label class="flex items-center justify-between text-xs text-muted-foreground">
                <span>Highlight weekends</span>
                <input type="checkbox" class="accent-primary" />
              </label>
            </div>
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
{/if}