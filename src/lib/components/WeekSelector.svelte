<!-- src/lib/components/WeekSelector.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Generate weeks with single date format
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    
    return {
      id: i,
      date,
      label: `W${4-i}`,
      dateText: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      }),
      isCurrent: i === 0
    };
  }).reverse();

  let selectedIndex = weeks.findIndex(w => w.isCurrent);

  function selectWeek(index: number) {
    selectedIndex = index;
    dispatch('select', weeks[index]);
  }
</script>

<div class="relative container">
  <!-- Timeline bar with glowing active section -->
  <div class="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2">
    <!-- Background line -->
    <div class="absolute h-4 inset-0 bg-blue-900/50" />
    
    <!-- Glowing active section -->
    <div 
      class="absolute h-4 w-1/4 transition-all duration-300 backdrop-blur-sm"
      style="left: {selectedIndex * 25}%"
    >
      <div class="absolute inset-0 bg-blue-500/50 blur-sm" />
      <div class="absolute inset-0 bg-blue-400" />
    </div>
  </div>

  <!-- Week markers -->
  <div class="relative grid grid-cols-4">
    {#each weeks as week, i}
      <button
        class="group flex flex-col items-center"
        class:text-blue-400={i === selectedIndex}
        class:text-blue-900={i !== selectedIndex}
        on:click={() => selectWeek(i)}
      >
        <!-- Marker dot -->
        <!-- <div 
          class="w-4 h-4 border-2 rounded-full mb-4 transition-colors duration-300
                 group-hover:border-blue-400 group-hover:bg-blue-950
                 {i === selectedIndex ? 'border-blue-400 bg-blue-950' : 'border-blue-900 bg-black'}"
        /> -->
        
        <!-- Week label -->
        <div class="text-xs font-medium tracking-wider mb-12 transition-colors duration-300
                    group-hover:text-blue-400">
          <!-- {week.label} -->
        </div>
        
        <!-- Date -->
        <div class="text-sm opacity-75 transition-colors duration-300
                    group-hover:text-blue-400 font-mono">
          {week.dateText}
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  button {
    transition: color 0.2s;
  }
</style>