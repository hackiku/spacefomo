<!-- src/lib/components/WeekSelector.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Generate dates for this week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i);
    return {
      full: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }),
      short: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      isToday: date.toDateString() === new Date().toDateString()
    };
  });

  let selectedIndex = weekDates.findIndex(d => d.isToday);

  function selectDate(index: number) {
    selectedIndex = index;
    dispatch('select', weekDates[index].full);
  }
</script>

<div class="w-full py-16 text-center">
  <div class="max-w-4xl mx-auto px-4">
    <h2 class="text-xl text-zinc-400 mb-8">This Week in Space</h2>
    
    <div class="flex justify-between items-center gap-4 overflow-x-auto pb-4">
      {#each weekDates as date, i}
        <button
          class="flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-200
                 {i === selectedIndex ? 
                   'text-zinc-100' : 
                   'text-zinc-500 hover:text-zinc-300'}"
          on:click={() => selectDate(i)}
        >
          <div class="text-2xl font-medium sm:text-3xl whitespace-nowrap">
            {date.short}
          </div>
          {#if date.isToday}
            <div class="mt-2 text-sm text-zinc-400">Today</div>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  /* For webkit browsers */
  .overflow-x-auto {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .overflow-x-auto::-webkit-scrollbar {
    display: none;
  }
</style>