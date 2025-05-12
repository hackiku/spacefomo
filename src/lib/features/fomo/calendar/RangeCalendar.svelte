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
  
  // Handle range selection change manually instead of with an effect
  function handleValueChange(event) {
    if (event?.start && event?.end) {
      dispatch('rangeSelected', { 
        start: event.start, 
        end: event.end 
      });
    }
  }
</script>

<RangeCalendar.Root
  class="rounded-default border border-border bg-card/30 shadow-lg p-4"
  weekdayFormat="short"
  fixedWeeks={true}
  bind:value
  bind:placeholder
  onValueChange={handleValueChange}
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="flex items-center justify-between mb-4">
      <RangeCalendar.PrevButton
        class="p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <CaretLeft class="h-4 w-4" />
      </RangeCalendar.PrevButton>
      
      <RangeCalendar.Heading class="text-sm font-medium text-foreground" />
      
      <RangeCalendar.NextButton
        class="p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
                  class="w-8 text-center text-xs text-muted-foreground"
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
                      class="flex items-center justify-center w-8 h-8 text-xs
                             text-foreground 
                             data-[today]:bg-muted
                             data-[outside-month]:text-muted-foreground/50 
                             data-[selected]:bg-primary data-[selected]:text-primary-foreground
                             data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground
                             data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground
                             data-[highlighted]:bg-primary/30
                             hover:bg-muted transition-colors"
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