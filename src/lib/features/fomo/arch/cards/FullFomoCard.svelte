<!-- src/lib/features/fomo/cards/FullFomoCard.svelte -->
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

<div class="rounded-2xl bg-zinc-800 border border-zinc-700">
  <div class="p-6">
    <div class="flex justify-between text-sm text-zinc-400 mb-2">
      <span>Week {weekNumber} FOMO</span>
      <span>{dateRange}</span>
    </div>
    <div class="flex items-center gap-2 mb-3">
      <span class="text-3xl bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-fuchsia-500">
        {score}
      </span>
      <span class="text-2xl">{emoji}</span>
    </div>
    <p class="text-zinc-300">{summary}</p>
  </div>
</div>