<!-- src/lib/features/fomo/week/Timeline.svelte -->
<script lang="ts">
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

<div class="fixed bottom-0 left-0 right-0 z-50">
  <div class="relative">    
    <!-- Timeline content -->
    <div class="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
      <div class="relative py-4 overflow-x-auto hide-scrollbar">
        <div class="flex gap-8 items-center min-w-max">
          {#each weeks as { weekNumber, score, startDate }}
            <button class="group flex flex-col items-center gap-2">
              <!-- Circle with score -->
              <div 
                class="w-10 h-10 rounded-full border border-zinc-800
                       flex items-center justify-center bg-zinc-900
                       group-hover:border-zinc-700 transition-colors"
              >
                <span class="text-sm font-medium text-transparent bg-clip-text
                            bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  {score}
                </span>
              </div>
              
              <!-- Date info -->
              <div class="text-xs">
                <span class="text-zinc-400">Week {weekNumber}</span>
                <span class="text-zinc-600 ml-2">{formatDate(startDate)}</span>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>