<!-- src/lib/features/fomo/calendar/CalendarButton.svelte -->
<script lang="ts">
  // Calendar button component - will be replaced with bits-ui calendar later
  
  // For now, just a placeholder that opens/closes a fake calendar
  let isOpen = $state(false);
  
  function toggleCalendar() {
    isOpen = !isOpen;
  }
</script>

<div class="relative">
  <button 
    type="button"
    class="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-300 hover:bg-zinc-700/80 transition-colors"
    onclick={toggleCalendar}
    aria-label="Open calendar"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  </button>
  
  {#if isOpen}
    <div class="absolute bottom-12 left-0 w-64 bg-zinc-800/90 border border-zinc-700/50 rounded-lg p-2 backdrop-blur-sm shadow-lg">
      <div class="text-center text-zinc-300 text-sm mb-2">Calendar placeholder</div>
      <!-- Placeholder calendar grid -->
      <div class="grid grid-cols-7 gap-1 text-center">
        {#each ["M", "T", "W", "T", "F", "S", "S"] as day}
          <div class="text-xs text-zinc-500">{day}</div>
        {/each}
        {#each Array(28) as _, i}
          <button class="w-8 h-8 rounded-full text-xs hover:bg-zinc-700 text-zinc-300">
            {i + 1}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>