<!-- src/lib/features/fomo/calendar/CalendarMenu.svelte -->

<script lang="ts">
  import { NavigationMenu } from "bits-ui";
  import { CalendarBlank, Clock } from 'phosphor-svelte';
  import { type DateValue } from "@internationalized/date";
  
  // Import the standalone calendar component
  import CalendarContent from "./CalendarContent.svelte";
  
  // Navigation menu state
  let activeItem = $state('date-picker');
  
  // Selected date ranges
  let startDate = $state<DateValue | null>(null);
  let endDate = $state<DateValue | null>(null);
  
  // Handle date selection from the calendar component
  function handleDateSelectionChange(start: DateValue | null, end: DateValue | null) {
    startDate = start;
    endDate = end;
    console.log('Selection changed:', { start, end });
  }
  
  // Set the current navigation item
  function setActive(item: string) {
    activeItem = item;
  }
  
  // Apply the date filter
  function applyDateFilter() {
    // Implement filtering logic here
    console.log('Applying date filter:', { startDate, endDate });
    
    // Close the menu after applying (optional)
    // Would need to bind an open state and toggle it
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
          <!-- Calendar component -->
          <div class="w-[280px]">
            <CalendarContent onSelectionChange={handleDateSelectionChange} />
          </div>
          
          <!-- Time controls placeholder -->
          <div class="w-[140px] border-l border-zinc-700/30 pl-4">
            <div class="text-zinc-300 text-xs font-medium mb-3 flex items-center">
              <Clock class="w-4 h-4 mr-1.5 text-zinc-400" />
              <span>Time Range</span>
            </div>
            
            <!-- Apply button -->
            <button
              class="w-full py-2 px-4 mt-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 
                     text-white rounded text-xs font-medium
                     transition-all hover:from-violet-600 hover:to-fuchsia-600"
              onclick={applyDateFilter}
            >
              Apply Range
            </button>
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