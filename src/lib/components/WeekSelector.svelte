<!-- src/lib/components/WeekSelector.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Generate weeks
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() - (i * 7));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return {
      id: i,
      startDate,
      endDate,
      label: `Week ${4-i}`,
      dateRange: `${startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })} - ${endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })}`,
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
  <!-- Progress Line -->
  <div class="absolute top-0 left-0 right-0 h-px bg-border overflow-hidden">
    <div 
      class="absolute h-full w-1/4 bg-primary transition-all duration-300"
      style="left: {selectedIndex * 25}%"
    />
  </div>

  <div class="grid grid-cols-4 gap-4">
    {#each weeks as week, i}
      <button
        class="group py-6 text-center"
        class:text-primary={i === selectedIndex}
        class:text-muted-foreground={i !== selectedIndex}
        on:click={() => selectWeek(i)}
      >
        <!-- Week Label -->
        <div class="text-2xl font-medium mb-2 transition-colors">
          {week.label}
        </div>
        
        <!-- Date Range -->
        <div class="text-sm opacity-75 transition-colors">
          {week.dateRange}
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