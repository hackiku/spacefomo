<!-- src/lib/features/fomo/Timeline.svelte -->
<script lang="ts">
  // Mock data - will be replaced with props later
  const weeks = Array(6).fill(null).map((_, i) => ({
    weekNumber: 6 - i,
    score: 85 - (i * 5),
    startDate: new Date(2024, 0, 1 + (i * 7))
  }));

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="relative py-8">
  <!-- Connecting line -->
  <div 
    class="absolute left-6 top-0 bottom-0 w-px bg-zinc-800"
    aria-hidden="true"
  />
  
  <!-- Timeline entries -->
  <div class="space-y-8">
    {#each weeks as { weekNumber, score, startDate }}
      <div class="group flex items-center gap-6">
        <!-- Circle with score -->
        <div 
          class="relative w-12 h-12 rounded-full border border-zinc-800
                 flex items-center justify-center bg-zinc-900"
        >
          <span class="text-sm font-medium text-transparent bg-clip-text
                      bg-gradient-to-r from-violet-400 to-fuchsia-400">
            {score}
          </span>
        </div>

        <!-- Date info -->
        <div class="flex gap-4 text-sm">
          <span class="text-zinc-400">Week {weekNumber}</span>
          <span class="text-zinc-600">{formatDate(startDate)}</span>
        </div>
      </div>
    {/each}
  </div>
</div>