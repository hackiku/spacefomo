<!-- src/lib/features/fomo/timeline/VerticalTimeline.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
  import FomoCard from './FomoCard.svelte';

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

  // Global expansion state
  let isExpanded = $state(false);
  let expandedCardId = $state<number | null>(null);

  function handleCardClick(week: { id: number; weekNumber: number }) {
    fomoStore.setActiveWeek(week.weekNumber);
    
    if (isExpanded && expandedCardId !== week.id) {
      expandedCardId = week.id;
    } else if (!isExpanded) {
      isExpanded = true;
      expandedCardId = week.id;
    } else {
      isExpanded = false;
      expandedCardId = null;
    }
  }
</script>

<div class="no-scrollbar relative h-full overflow-y-auto">
  <div class="relative pr-4">
    <div class="flex gap-10 sm:gap-16 md:gap-20 md:flex-col">
      {#each $fomoStore.weeks as week, i (week.id)}
        {@const isSelected = $fomoStore.currentWeek?.id === week.id}
        <div class="relative flex-shrink-0 md:flex-shrink">
          
					<!-- Line connecting timeline points -->
          {#if i < $fomoStore.weeks.length - 1}
            <div class="absolute left-6 h-full w-px">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-800 to-transparent">
              </div>
            </div>
          {/if}

          <!-- Date marker -->
          <div class="mb-6 flex flex-col items-center gap-2 md:mx-4.5 md:flex-row">
            <div class="relative h-3.5 w-3.5">
              <div class="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 
                          rounded-full bg-zinc-700">
              </div>
              {#if isSelected}
                <div class="absolute inset-0 animate-ping rounded-full border-2 border-violet-500/50">
                </div>
              {/if}
            </div>
            <time datetime={week.startDate.toISOString()} class="text-sm text-zinc-500">
              {formatDate(week.startDate)}
            </time>
          </div>

          <!-- FOMO Card -->
          <div class="relative">
            <FomoCard
              weekNumber={week.weekNumber}
              dateRange={`${formatDate(week.startDate)} - ${formatDate(week.endDate)}`}
              score={week.score}
              emoji={getFomoEmoji(week.score)}
              summary={week.summary}
              isSelected={isSelected}
              isExpanded={expandedCardId === week.id}
              onClick={() => handleCardClick(week)}
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