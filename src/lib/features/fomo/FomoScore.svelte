<!-- src/lib/features/fomo/FomoScore.svelte -->
<script lang="ts">
  import type { WeekStats } from '$lib/types';

  export let score: number;
  export let stats: WeekStats;

  const statLabels: { [K in keyof WeekStats]: string } = {
    launchActivity: 'Launch Activity',
    industryBuzz: 'Industry Buzz',
    techImpact: 'Tech Impact'
  };

  function getEntries(obj: WeekStats): [keyof WeekStats, number][] {
    return Object.entries(obj) as [keyof WeekStats, number][];
  }
</script>

<div class="w-full flex flex-row md:flex-col gap-6 p-6">
  <!-- Score section - more compact -->
  <div class="flex-shrink-0">
    <div class="text-6xl md:text-7xl font-bold bg-clip-text text-transparent
                bg-gradient-to-br from-violet-400 to-fuchsia-500">
      {score}
    </div>
    <div class="text-sm font-medium uppercase tracking-wider text-zinc-400">
      FOMO Level
    </div>
  </div>

  <!-- Stats section - more flexible -->
  <div class="flex-grow space-y-3">
    {#each getEntries(stats) as [key, value]}
      <div class="flex items-center gap-2">
        <div class="h-1 w-full rounded-full overflow-hidden bg-zinc-800">
          <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
               style="width: {value}%" />
        </div>
        <span class="text-xs whitespace-nowrap text-zinc-500">
          {statLabels[key]}
        </span>
      </div>
    {/each}
  </div>
</div>
