<!-- src/lib/features/fomo/WeekTimeline.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fomoStore } from '$lib/stores/fomoStore';

  let scrollContainer: HTMLDivElement;
  
  onMount(() => {
    // Scroll to current week on mobile
    if (window.innerWidth < 768) {
      const weekWidth = scrollContainer.scrollWidth / $fomoStore.weeks.length;
      scrollContainer.scrollLeft = weekWidth * $fomoStore.currentWeekIndex;
    }
  });
</script>

<div class="relative pb-4 pt-2">
  <!-- Fade effect on the left - matched to parent background -->
  <div class="absolute left-0 top-0 bottom-0 w-32 pointer-events-none
              bg-gradient-to-r from-zinc-900/80 to-transparent
              z-10" />

  <!-- Scrollable container with adjusted spacing -->
  <div 
    bind:this={scrollContainer}
    class="overflow-x-auto md:overflow-x-visible 
           -mx-4 px-4 md:mx-0 md:px-0
           scrollbar-none" 
  >
    <!-- Week bars with consistent width -->
    <div class="grid grid-cols-4 gap-4 min-w-[600px] md:min-w-0">
      {#each $fomoStore.weeks as week, i}
        <button
          class="group flex flex-col items-center"
          on:click={() => fomoStore.setCurrentWeek(i)}
        >
          <!-- Progress bar/week selector -->
          <div class="w-full h-3 rounded-full transition-colors duration-300
                      {i === $fomoStore.currentWeekIndex ? 
                        'bg-gradient-to-r from-violet-500 to-fuchsia-500' : 
                        'bg-zinc-800 group-hover:bg-zinc-700'}"
          />
          
          <!-- Date label with consistent spacing -->
          <div class="mt-2 text-xs font-medium
                      {i === $fomoStore.currentWeekIndex ?
                        'text-white' :
                        'text-zinc-600'}">
            {week.startDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Optional: Right fade effect for visual balance -->
  <div class="absolute right-0 top-0 bottom-0 w-32 pointer-events-none
              bg-gradient-to-l from-zinc-900/80 to-transparent
              z-10 md:hidden" />
</div>

<style>
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
</style>