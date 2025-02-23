<!-- src/lib/features/fomo/Timeline.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
  import CompactFomoCard from './cards/CompactFomoCard.svelte';
  import FullFomoCard from './cards/FullFomoCard.svelte';
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getFomoEmoji = (score: number): string => {
    if (score >= 80) return '🤯';
    if (score >= 60) return '🚀';
    if (score >= 40) return '👀';
    if (score >= 20) return '🤔';
    return '😴';
  };
</script>

<div class="relative h-full overflow-hidden">
  <!-- Mobile horizontal scroll -->
  <div class="lg:hidden w-full overflow-x-auto pb-4 no-scrollbar">
    <div class="flex gap-4 px-4 min-w-max">
      {#each $fomoStore.weeks as week (week.id)}
        {@const isActive = $fomoStore.currentWeek?.id === week.id}
        <button
          class="relative transition-all"
          onclick={() => fomoStore.setActiveWeek(week.weekNumber)}
        >
          <CompactFomoCard
            score={week.score}
            emoji={getFomoEmoji(week.score)}
            isActive={isActive}
          />
        </button>
      {/each}
    </div>
  </div>

  <!-- Desktop vertical timeline -->
  <div class="hidden lg:block h-full overflow-y-auto no-scrollbar">
    <div class="relative">
      <!-- Center line with gradient -->
      <div class="absolute left-4 top-0 bottom-0 w-px">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
      </div>

      <!-- Timeline items -->
      <div class="space-y-6">
        {#each $fomoStore.weeks as week (week.id)}
          {@const isActive = $fomoStore.currentWeek?.id === week.id}
          <div class="relative">
            <!-- Date indicator -->
            <div class="flex items-center gap-4 mb-2">
              <div class="relative w-4 h-4">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          w-2 h-2 rounded-full bg-zinc-700"></div>
                {#if isActive}
                  <div class="absolute inset-0 rounded-full border-2 border-violet-500/50 
                            animate-ping"></div>
                {/if}
              </div>
              <span class="text-sm text-zinc-500">{formatDate(week.startDate)}</span>
            </div>

            <!-- FOMO Card -->
            <div class="pl-8">
              <button
                class="w-full transition-all duration-200"
                class:opacity-60={!isActive}
                class:hover:opacity-100={!isActive}
                onclick={() => fomoStore.setActiveWeek(week.weekNumber)}
              >
                {#if isActive}
                  <FullFomoCard
                    weekNumber={week.weekNumber}
                    dateRange={`${formatDate(week.startDate)} - ${formatDate(week.endDate)}`}
                    score={week.score}
                    emoji={getFomoEmoji(week.score)}
                    summary={week.summary}
                  />
                {:else}
                  <CompactFomoCard
                    score={week.score}
                    emoji={getFomoEmoji(week.score)}
                    isActive={false}
                  />
                {/if}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>