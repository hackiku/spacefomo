<!-- src/lib/features/fomo/calendar/CalendarButton.svelte -->
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  import { CalendarBlank, CaretLeft, CaretRight } from 'phosphor-svelte';
  import { today, getLocalTimeZone } from "@internationalized/date";
  
  // Initialize with today's date
  let placeholder = $state(today(getLocalTimeZone()));
  
  // DateRange value - undefined by default
  let value = $state(undefined);
  
  // Open state
  let open = $state(false);
</script>

<div class="relative">
  <DateRangePicker.Root
    bind:value
    bind:placeholder
    bind:open
    weekdayFormat="short"
    fixedWeeks={true}
    class="flex w-full max-w-[340px] flex-col gap-1.5"
  >
    
    <!-- Input container -->
    <div class="flex w-full items-center border border-zinc-700/50 bg-zinc-800/80 rounded-full px-3 py-2">
      {#each ["start", "end"] as type}
        <DateRangePicker.Input {type}>
          {#snippet children({ segments })}
            {#each segments as { part, value }}
              <div class="inline-block select-none">
                {#if part === "literal"}
                  <DateRangePicker.Segment
                    {part}
                    class="text-zinc-500 p-1"
                  >
                    {value}
                  </DateRangePicker.Segment>
                {:else}
                  <DateRangePicker.Segment
                    {part}
                    class="rounded px-1 py-1 text-zinc-300 hover:bg-zinc-700/50 focus:bg-zinc-700/50 aria-[valuetext=Empty]:text-zinc-500"
                  >
                    {value}
                  </DateRangePicker.Segment>
                {/if}
              </div>
            {/each}
          {/snippet}
        </DateRangePicker.Input>
        
        {#if type === "start"}
          <div aria-hidden="true" class="text-zinc-500 px-1">–</div>
        {/if}
      {/each}
      
      <!-- Trigger button -->
      <DateRangePicker.Trigger
        class="ml-auto inline-flex h-6 w-6 items-center justify-center text-zinc-400 hover:text-zinc-300"
      >
        <CalendarBlank class="h-4 w-4" />
      </DateRangePicker.Trigger>
    </div>
    
    <!-- Content and calendar -->
    <DateRangePicker.Content 
      sideOffset={6} 
      class="z-50 bg-zinc-800/95 border border-zinc-700/50 rounded-lg shadow-lg p-4 backdrop-blur-sm"
    >
      <DateRangePicker.Calendar class="rounded-lg border-zinc-700/50">
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
    </DateRangePicker.Content>
  </DateRangePicker.Root>
</div>