<!-- src/lib/features/fomo/FomoCardContainer.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
  import { CaretDown } from 'phosphor-svelte';
  import { slide } from 'svelte/transition';
  
  // Local state
  let isExpanded = $state(false);
  
  // Reset expanded state when active week changes
  $effect(() => {
    if ($fomoStore.activeWeek) {
      isExpanded = false;
    }
  });
  
  // Format date helper
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="relative w-full py-2">
  {#if $fomoStore.weeks.length > 0}
    {@const currentWeek = $fomoStore.weeks.find(w => w.weekNumber === $fomoStore.activeWeek)}
    {#if currentWeek}
      <button
        type="button"
        class="w-full text-left transition-all duration-200 group rounded-2xl bg-zinc-800/80 border border-zinc-700/80 p-3 relative hover:bg-zinc-800/90"
        onclick={() => isExpanded = !isExpanded}
      >
        <div class="flex items-center justify-between">
          <span class="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-fuchsia-500">
            {currentWeek.score}
          </span>
          
          <div class="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-transform duration-200" class:rotate-180={isExpanded}>
            <CaretDown />
          </div>
        </div>

        {#if isExpanded}
          <div class="mt-4 space-y-3" transition:slide={{ duration: 150 }}>
            <div class="flex justify-between text-sm text-zinc-400">
              <span>Week {currentWeek.weekNumber} FOMO</span>
              <span>{formatDate(currentWeek.startDate)} - {formatDate(currentWeek.endDate)}</span>
            </div>
            <p class="text-zinc-300">{currentWeek.summary}</p>
            
            <!-- Stats -->
            <div class="grid grid-cols-3 gap-2 pt-3">
              <div>
                <div class="text-xs text-zinc-500 mb-1">Launch</div>
                <div class="h-1 w-full bg-zinc-700 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: {currentWeek.stats.launchActivity}%"></div>
                </div>
                <div class="text-right text-xs text-emerald-400 mt-1">{currentWeek.stats.launchActivity}</div>
              </div>
              
              <div>
                <div class="text-xs text-zinc-500 mb-1">Buzz</div>
                <div class="h-1 w-full bg-zinc-700 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" style="width: {currentWeek.stats.industryBuzz}%"></div>
                </div>
                <div class="text-right text-xs text-blue-400 mt-1">{currentWeek.stats.industryBuzz}</div>
              </div>
              
              <div>
                <div class="text-xs text-zinc-500 mb-1">Tech</div>
                <div class="h-1 w-full bg-zinc-700 rounded-full overflow-hidden">
                  <div class="h-full bg-violet-500 rounded-full" style="width: {currentWeek.stats.techImpact}%"></div>
                </div>
                <div class="text-right text-xs text-violet-400 mt-1">{currentWeek.stats.techImpact}</div>
              </div>
            </div>
          </div>
        {/if}
      </button>
    {/if}
  {/if}
</div>