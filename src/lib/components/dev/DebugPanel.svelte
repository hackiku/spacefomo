<!-- src/lib/components/dev/DebugPanel.svelte -->

<script lang="ts">
  interface WeekStats {
    launchActivity: number;
    industryBuzz: number;
    techImpact: number;
  }

  interface Week {
    weekNumber: number;
    score: number;
    createdAt: Date;
    summary: string;
    stats: WeekStats;
  }

  interface Debug {
    error?: string;
    details?: string;
    success?: boolean;
    weekCount?: number;
  }

  export let currentWeek: Week | null = null;
  export let debug: Debug;
</script>

<div
  class="absolute top-4 left-4 z-50 w-64 rounded-lg bg-zinc-900/90 p-4 shadow-xl backdrop-blur"
>
  {#if debug.error}
    <p class="text-sm text-red-500">{debug.error}</p>
    {#if debug.details}
      <p class="mt-1 text-xs text-red-400">{debug.details}</p>
    {/if}
  {:else if currentWeek}
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-zinc-700 pb-2">
        <h3 class="font-medium text-zinc-200">Week {currentWeek.weekNumber}</h3>
        <span class="text-sm text-zinc-400">{currentWeek.score}%</span>
      </div>
      <p class="text-xs text-zinc-500">
        Created: {new Date(currentWeek.createdAt).toLocaleDateString()}
      </p>
      <div class="mt-2 text-sm text-zinc-300">
        <p>{currentWeek.summary}</p>
      </div>
      <div class="mt-2 grid grid-cols-3 gap-2 text-xs">
        <div class="text-emerald-400">
          Launch: {currentWeek.stats.launchActivity}
        </div>
        <div class="text-blue-400">
          Buzz: {currentWeek.stats.industryBuzz}
        </div>
        <div class="text-purple-400">
          Tech: {currentWeek.stats.techImpact}
        </div>
      </div>
    </div>
  {:else}
    <p class="text-sm text-zinc-500">No current week data</p>
  {/if}
</div>