<!-- src/lib/features/fomo/FomoScore.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
</script>

<div class="flex flex-row md:flex-col gap-8 p-8">
  <!-- Score section -->
  <div class="flex-shrink-0">
    <!-- Score with gradient -->
    <div class="text-7xl md:text-8xl font-bold bg-clip-text text-transparent
                bg-gradient-to-br from-violet-600 to-fuchsia-600
                dark:from-violet-400 dark:to-fuchsia-500">
      {$fomoStore.currentScore}
    </div>
    
    <!-- Label -->
    <div class="text-sm font-medium uppercase tracking-wider
                text-zinc-600 dark:text-zinc-400">
      FOMO Level
    </div>
  </div>

  <!-- Stats section -->
  <div class="flex-grow min-w-[200px] space-y-4">
    {#each ['Launch Activity', 'Industry Buzz', 'Tech Impact'] as stat}
      <div class="flex items-center gap-2">
        <div class="h-1 w-full min-w-[100px] rounded-full overflow-hidden
                    bg-zinc-200 dark:bg-zinc-800">
          <div class="h-full w-[85%] rounded-full
                      bg-gradient-to-r from-violet-600 to-fuchsia-600
                      dark:from-violet-500 dark:to-fuchsia-500" />
        </div>
        <span class="text-xs flex-shrink-0 text-zinc-600 dark:text-zinc-500">{stat}</span>
      </div>
    {/each}
  </div>
</div>``