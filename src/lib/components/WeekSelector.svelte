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
      dateText: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
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
  <!-- Progress bar -->
  <div class="absolute top-0 left-0 right-0 h-px overflow-hidden
              dark:bg-zinc-800 light:bg-zinc-200">
    <div 
      class="absolute h-full w-1/4 transition-all duration-300
             dark:bg-gradient-to-r dark:from-violet-500 dark:to-fuchsia-500
             light:bg-gradient-to-r light:from-violet-600 light:to-fuchsia-600"
      style="left: {selectedIndex * 25}%"
    />
  </div>

  <div class="grid grid-cols-4 gap-4">
    {#each weeks as week, i}
      <button
        class="group py-6 text-center"
        class:dark:text-white={i === selectedIndex}
        class:dark:text-zinc-600={i !== selectedIndex}
        class:light:text-black={i === selectedIndex}
        class:light:text-zinc-500={i !== selectedIndex}
        on:click={() => selectWeek(i)}
      >
        <div class="relative">
          <!-- Glow effect for selected -->
          {#if i === selectedIndex}
            <div class="absolute -inset-2 rounded-lg blur-sm
                        dark:bg-violet-500/20 light:bg-violet-500/10" />
          {/if}
          
          <!-- Date -->
          <div class="relative text-sm font-medium transition-colors duration-300
                      dark:group-hover:text-white light:group-hover:text-black">
            {week.dateText}
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>