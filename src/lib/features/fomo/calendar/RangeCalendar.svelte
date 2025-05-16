<!-- src/lib/features/fomo/calendar/RangeCalendar.svelte -->
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
  import { CaretLeft, CaretRight } from 'phosphor-svelte';
  import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
  import { createEventDispatcher } from 'svelte';
  
  // Set up event dispatcher for backward compatibility
  const dispatch = createEventDispatcher<{
    rangeSelected: { start: DateValue | undefined, end: DateValue | undefined }
  }>();
  
  // Props
  let { 
    value = $bindable(),
    isDateDisabled = null,
  } = $props<{
    value?: { start: DateValue | undefined, end: DateValue | undefined };
    isDateDisabled?: ((date: DateValue) => boolean) | null;
  }>();
  
  // Initialize with today's date as placeholder
  let placeholder = $state(today(getLocalTimeZone()));
  
  // Default function to disable future dates if no custom function provided
  function defaultIsDateDisabled(date: DateValue): boolean {
    const todayDate = today(getLocalTimeZone());
    return date.compare(todayDate) > 0;
  }
  
  // Use provided function or default
  const checkIsDateDisabled = isDateDisabled || defaultIsDateDisabled;
  
  // Handle range selection change
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
  class="rounded-default border border-border bg-card/30 shadow-sm p-4"
  weekdayFormat="short"
  fixedWeeks={true}
  bind:value
  bind:placeholder
  onValueChange={handleValueChange}
  isDateDisabled={checkIsDateDisabled}
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="flex items-center justify-between mb-6">
      <RangeCalendar.PrevButton
        class="p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors rounded-default"
      >
        <CaretLeft class="h-5 w-5" />
      </RangeCalendar.PrevButton>
      
      <RangeCalendar.Heading class="text-base font-medium text-foreground" />
      
      <RangeCalendar.NextButton
        class="p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors rounded-default"
      >
        <CaretRight class="h-5 w-5" />
      </RangeCalendar.NextButton>
    </RangeCalendar.Header>
    
    <div class="flex flex-col space-y-4">
      {#each months as month}
        <RangeCalendar.Grid
          class="w-full select-none"
        >
          <RangeCalendar.GridHead>
            <RangeCalendar.GridRow class="flex justify-between mb-4">
              {#each weekdays as day}
                <RangeCalendar.HeadCell
                  class="w-9 text-center text-sm text-muted-foreground font-medium"
                >
                  <div>{day.slice(0, 1)}</div>
                </RangeCalendar.HeadCell>
              {/each}
            </RangeCalendar.GridRow>
          </RangeCalendar.GridHead>
          
          <RangeCalendar.GridBody>
            {#each month.weeks as weekDates}
              <RangeCalendar.GridRow class="flex justify-between mb-2">
                {#each weekDates as date}
                  <RangeCalendar.Cell
                    {date}
                    month={month.value}
                    class="p-0 relative"
                  >
                    <RangeCalendar.Day
                      class="flex items-center justify-center w-9 h-9 text-base
                             text-foreground font-medium
                             data-[today]:border data-[today]:border-primary/30 data-[today]:bg-muted/40
                             data-[outside-month]:text-muted-foreground/40 
                             data-[selected]:bg-primary data-[selected]:text-primary-foreground
                             data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground
                             data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground
                             data-[highlighted]:bg-primary/30
                             data-[disabled]:opacity-30 data-[disabled]:cursor-not-allowed
                             hover:bg-muted transition-colors rounded-default"
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