<!-- src/lib/features/fomo/FomoScore.svelte -->
<script lang="ts">
  import type { WeekStats } from '$lib/types';

  export let score: number;
  export let stats: WeekStats;

  // Explicitly type statLabels to match WeekStats keys
  const statLabels: { [K in keyof WeekStats]: string } = {
    launchActivity: 'Launch Activity',
    industryBuzz: 'Industry Buzz',
    techImpact: 'Tech Impact'
  };

  // Type-safe entries helper
  function getEntries(obj: WeekStats): [keyof WeekStats, number][] {
    return Object.entries(obj) as [keyof WeekStats, number][];
  }
</script>

<div class="flex flex-row md:flex-col gap-8 p-8">
  <!-- Score section -->
  <div class="flex-shrink-0">
    <!-- Score with gradient -->
    <div class="text-7xl md:text-8xl font-bold bg-clip-text text-transparent
                bg-gradient-to-br from-violet-400 to-fuchsia-500">
      {score}
    </div>
    
    <!-- Label -->
    <div class="text-sm font-medium uppercase tracking-wider text-zinc-400">
      FOMO Level
    </div>
  </div>

  <!-- Stats section -->
  <div class="flex-grow min-w-[200px] space-y-4">
    {#each getEntries(stats) as [key, value]}
      <div class="flex items-center gap-2">
        <div class="h-1 w-full min-w-[100px] rounded-full overflow-hidden bg-zinc-800">
          <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
               style="width: {value}%" />
        </div>
        <span class="text-xs flex-shrink-0 text-zinc-500">
          {statLabels[key]}
        </span>
      </div>
    {/each}
  </div>
</div>