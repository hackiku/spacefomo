<!-- src/lib/features/fomo/FomoCardContainer.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
  import FomoCard from './FomoCard.svelte';

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  let isExpanded = $state(false);

  $effect(() => {
    if ($fomoStore.activeWeek) {
      isExpanded = false;
    }
  });
</script>

<div class="relative w-full py-2 pr-20">
  {#if $fomoStore.weeks.length > 0}
    {@const currentWeek = $fomoStore.weeks.find(w => w.weekNumber === $fomoStore.activeWeek)}
    {#if currentWeek}
      <FomoCard
        weekNumber={currentWeek.weekNumber}
        dateRange={`${formatDate(currentWeek.startDate)} - ${formatDate(currentWeek.endDate)}`}
        score={currentWeek.score}
        summary={currentWeek.summary}
        {isExpanded}
        onClick={() => isExpanded = !isExpanded}
      />
    {/if}
  {/if}
</div>