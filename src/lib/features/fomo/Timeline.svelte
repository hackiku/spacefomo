<!-- src/lib/features/fomo/Timeline.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
  import FomoCard from './cards/FomoCard.svelte';
  
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

  let expandedCards = $state(new Set<number>());

  function toggleCard(weekId: number) {
    if (expandedCards.has(weekId)) {
      expandedCards.delete(weekId);
    } else {
      expandedCards.add(weekId);
    }
  }
</script>

<div class="relative h-full overflow-y-auto no-scrollbar">
  <div class="relative pr-4">
    <!-- Center line with gradient -->
    <div class="absolute left-[0.875rem] top-0 bottom-0 w-px">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
    </div>

    <!-- Timeline items -->
    <div class="space-y-6">
      {#each $fomoStore.weeks as week (week.id)}
        {@const isActive = $fomoStore.currentWeek?.id === week.id}
        <div class="relative">
          <!-- Date indicator -->
          <div class="flex items-center gap-4 mb-2">
            <div class="relative w-3.5 h-3.5">
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
          <div class="ml-7">
            <FomoCard
              weekNumber={week.weekNumber}
              dateRange={`${formatDate(week.startDate)} - ${formatDate(week.endDate)}`}
              score={week.score}
              emoji={getFomoEmoji(week.score)}
              summary={week.summary}
              isActive={isActive}
              isExpanded={expandedCards.has(week.id)}
              onClick={() => fomoStore.setActiveWeek(week.weekNumber)}
              onToggle={() => toggleCard(week.id)}
            />
          </div>
        </div>
      {/each}
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