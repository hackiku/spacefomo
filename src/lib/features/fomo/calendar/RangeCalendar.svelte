<!-- src/lib/features/fomo/calendar/RangeCalendar.svelte -->
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
  import { CaretLeft, CaretRight } from 'phosphor-svelte';
  import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
  import { createEventDispatcher } from 'svelte';
  
  // Set up event dispatcher
  const dispatch = createEventDispatcher<{
    rangeSelected: { start: DateValue | undefined, end: DateValue | undefined }
  }>();
  
  // Props
  let { 
    value = $bindable(),
    startDate = null, 
    endDate = null,
  } = $props<{
    value?: { start: DateValue | undefined, end: DateValue | undefined };
    startDate?: Date | null;
    endDate?: Date | null;
  }>();
  
  // Initialize with today's date as placeholder
  let placeholder = $state(today(getLocalTimeZone()));
  
  // When range selection changes, dispatch an event
  $effect(() => {
    if (value?.start && value?.end) {
      dispatch('rangeSelected', { 
        start: value.start, 
        end: value.end 
      });
    }
  });
</script>

<RangeCalendar.Root
  class="rounded-lg border border-zinc-700/50 bg-zinc-800/30 shadow-lg p-4"
  weekdayFormat="short"
  fixedWeeks={true}
  bind:value
  bind:placeholder
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="flex items-center justify-between mb-4">
      <RangeCalendar.PrevButton
        class="rounded-full p-2 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300 transition-colors"
      >
        <CaretLeft class="h-4 w-4" />
      </RangeCalendar.PrevButton>
      
      <RangeCalendar.Heading class="text-sm font-medium text-zinc-300" />
      
      <RangeCalendar.NextButton
        class="rounded-full p-2 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300 transition-colors"
      >
        <CaretRight class="h-4 w-4" />
      </RangeCalendar.NextButton>
    </RangeCalendar.Header>
    
    <div class="flex flex-col space-y-4">
      {#each months as month}
        <RangeCalendar.Grid
          class="w-full select-none"
        >
          <RangeCalendar.GridHead>
            <RangeCalendar.GridRow class="flex justify-between mb-2">
              {#each weekdays as day}
                <RangeCalendar.HeadCell
                  class="w-8 text-center text-xs text-zinc-500"
                >
                  <div>{day.slice(0, 1)}</div>
                </RangeCalendar.HeadCell>
              {/each}
            </RangeCalendar.GridRow>
          </RangeCalendar.GridHead>
          
          <RangeCalendar.GridBody>
            {#each month.weeks as weekDates}
              <RangeCalendar.GridRow class="flex justify-between mb-1">
                {#each weekDates as date}
                  <RangeCalendar.Cell
                    {date}
                    month={month.value}
                    class="p-0 relative"
                  >
                    <RangeCalendar.Day
                      class="flex items-center justify-center w-8 h-8 rounded-full text-xs
                             text-zinc-300 
                             data-[today]:bg-zinc-700/50
                             data-[outside-month]:text-zinc-600 
                             data-[selected]:bg-violet-600/90 data-[selected]:text-white
                             data-[selection-start]:bg-violet-600 data-[selection-start]:text-white
                             data-[selection-end]:bg-violet-600 data-[selection-end]:text-white
                             data-[highlighted]:bg-violet-600/30
                             hover:bg-zinc-700/50 transition-colors"
                    >
                      {date.day}
                    </RangeCalendar.Day>
                  </RangeCalendar.Cell>
                {/each}
              </RangeCalendar.GridRow>
            {/each}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      {/each}
    </div>
  {/snippet}
</RangeCalendar.Root>