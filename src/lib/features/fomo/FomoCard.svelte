<!-- src/lib/features/fomo/FomoCard.svelte -->
<script lang="ts">
  let { 
    weekNumber,
    dateRange,
    score,
    emoji,
    summary 
  } = $props<{
    weekNumber: number;
    dateRange: string;
    score: number;
    emoji: string;
    summary: string;
  }>();
</script>

<div class="rounded-t-2xl bg-zinc-800 border-t border-l border-r border-zinc-700">
  <div class="p-4">
    <div class="flex justify-between text-sm text-zinc-400 mb-2">
      <span>Week {weekNumber}</span>
      <span>{dateRange}</span>
    </div>
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">{emoji}</span>
      <span class="text-xl bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-fuchsia-500">
        {score}
      </span>
    </div>
    <p class="text-zinc-300">{summary}</p>
  </div>
</div>