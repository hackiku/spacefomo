<!-- src/lib/components/WeekSelector.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

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

<div class="container max-w-6xl mx-auto px-8 md:px-12">
  <!-- Timeline with constructivist style -->
  <div class="relative">
    <!-- Timeline bar -->
    <div class="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-[#e9d89c]/20" />
    
    <!-- Active section -->
    <div 
      class="absolute top-1/2 h-0.5 w-1/4 -translate-y-1/2 bg-[#cd3d21] transition-all duration-300"
      style="left: {selectedIndex * 25}%"
    />
    
    <!-- Week markers -->
    <div class="relative grid grid-cols-4 gap-4">
      {#each weeks as week, i}
				<button
					class="group flex flex-col items-center py-8 {
						i === selectedIndex ? 'text-[#cd3d21]' : 'text-[#e9d89c]/60'
					}"
					on:click={() => selectWeek(i)}
				>
          <!-- Marker square (constructivist style) -->
          <div 
            class="w-4 h-4 mb-4 rotate-45 transition-colors duration-300
                   border-2 group-hover:border-[#cd3d21]
									 {i === selectedIndex ? 'bg-[#cd3d21] border-[#cd3d21]' : 'border-[#e9d89c]/30'
									}"
          />
          <!-- Date -->
          <div class="font-mono text-sm tracking-wider transition-colors duration-300
                      group-hover:text-[#cd3d21]">
            {week.dateText}
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>