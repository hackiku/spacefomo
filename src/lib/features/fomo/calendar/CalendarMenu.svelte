<!-- src/lib/features/fomo/calendar/CalendarMenu.svelte -->
<script lang="ts">
  import { NavigationMenu } from "bits-ui";
  import { 
    DateRangePicker, 
    type DateRange 
  } from "bits-ui";
  import { 
    CalendarBlank, 
    CaretLeft, 
    CaretRight,
    Clock
  } from 'phosphor-svelte';
  import { today, getLocalTimeZone } from "@internationalized/date";
  
  // Initialize with today's date
  let placeholder = $state(today(getLocalTimeZone()));
  
  // DateRange value - undefined by default
  let value = $state<DateRange | undefined>(undefined);
  
  // Navigation menu state
  let open = $state(false);
  
  // Set active item to 'date-picker' by default
  let activeItem = $state('date-picker');
  
  // Set the current navigation item
  function setActive(item: string) {
    activeItem = item;
  }
</script>

<NavigationMenu.Root 
  class="relative" 
  value={activeItem} 
  onValueChange={setActive}
>
  <NavigationMenu.List
    class="flex items-center"
  >
    <!-- Date picker menu item -->
    <NavigationMenu.Item value="date-picker">
      <!-- Calendar icon as trigger -->
      <NavigationMenu.Trigger
        class="inline-flex items-center justify-center rounded-full 
              w-10 h-10
              bg-zinc-800 hover:bg-zinc-700 text-zinc-200
              transition-all hover:text-white active:scale-95"
        aria-label="Date filter"
      >
        <CalendarBlank class="w-5 h-5" />
      </NavigationMenu.Trigger>
      
      <!-- Content opens upward -->
      <NavigationMenu.Content
        class="absolute bottom-full left-0 mb-2 z-50" 
        align="start"
        sideOffset={12}
      >
        <div class="flex gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700/50 shadow-xl">
          <!-- Date range picker -->
          <div class="w-[280px]">
            <DateRangePicker.Calendar
              bind:value
              bind:placeholder
              weekdayFormat="short"
              fixedWeeks={true}
              class="w-full"
            >
              {#snippet children({ months, weekdays })}
                <DateRangePicker.Header class="flex items-center justify-between mb-4">
                  <DateRangePicker.PrevButton class="rounded-full p-2 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300">
                    <CaretLeft size={16} />
                  </DateRangePicker.PrevButton>
                  <DateRangePicker.Heading class="text-sm font-medium text-zinc-300" />
                  <DateRangePicker.NextButton class="rounded-full p-2 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300">
                    <CaretRight size={16} />
                  </DateRangePicker.NextButton>
                </DateRangePicker.Header>
                
                <div class="space-y-4">
                  {#each months as month}
                    <DateRangePicker.Grid class="w-full select-none">
                      <DateRangePicker.GridHead>
                        <DateRangePicker.GridRow class="flex justify-between mb-2">
                          {#each weekdays as day}
                            <DateRangePicker.HeadCell class="w-8 text-center text-xs text-zinc-500">
                              <div>{day.slice(0, 1)}</div>
                            </DateRangePicker.HeadCell>
                          {/each}
                        </DateRangePicker.GridRow>
                      </DateRangePicker.GridHead>
                      
                      <DateRangePicker.GridBody>
                        {#each month.weeks as weekDates}
                          <DateRangePicker.GridRow class="flex justify-between mb-1">
                            {#each weekDates as date}
                              <DateRangePicker.Cell 
                                {date} 
                                month={month.value}
                                class="p-0 relative"
                              >
                                <DateRangePicker.Day 
                                  class="flex items-center justify-center w-8 h-8 rounded-full text-xs
                                        text-zinc-300 
                                        data-today:bg-zinc-700/50
                                        data-outside-month:text-zinc-600 
                                        data-selected:bg-violet-600/90 data-selected:text-white
                                        data-selection-start:bg-violet-600 data-selection-start:text-white
                                        data-selection-end:bg-violet-600 data-selection-end:text-white
                                        hover:bg-zinc-700/50"
                                >
                                  {date.day}
                                </DateRangePicker.Day>
                              </DateRangePicker.Cell>
                            {/each}
                          </DateRangePicker.GridRow>
                        {/each}
                      </DateRangePicker.GridBody>
                    </DateRangePicker.Grid>
                  {/each}
                </div>
              {/snippet}
            </DateRangePicker.Calendar>
          </div>
          
          <!-- Time controls placeholder -->
          <div class="w-[140px] border-l border-zinc-700/30 pl-4">
            <div class="text-zinc-300 text-xs font-medium mb-3 flex items-center">
              <Clock class="w-4 h-4 mr-1.5 text-zinc-400" />
              <span>Time Range</span>
            </div>
            
            <!-- Date display feedback -->
            {#if value?.start}
              <div class="text-xs text-zinc-400 mb-3">
                Selected: {formatDate(value.start instanceof Date ? value.start : new Date(value.start.toString()))}
                {#if value.end}
                  - {formatDate(value.end instanceof Date ? value.end : new Date(value.end.toString()))}
                {/if}
              </div>
            {/if}
            
            <!-- Time granularity selector placeholder -->
            <div class="space-y-3">
              <div class="text-zinc-400 text-xs">
                Time granularity controls will be added here
              </div>
            </div>
          </div>
        </div>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  
  <!-- Viewport for content -->
  <div class="absolute z-50">
    <NavigationMenu.Viewport 
      class="w-[var(--bits-navigation-menu-viewport-width)] 
             h-[var(--bits-navigation-menu-viewport-height)]
             animate-in fade-in duration-200"
    />
  </div>
</NavigationMenu.Root>

<script context="module">
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>