<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import News from '$lib/features/news/News.svelte';
  import Timeline from '$lib/features/fomo/week/Timeline.svelte';
  import Controls from '$lib/features/news/controls/Controls.svelte';
  import GridLayout from '$lib/layout/GridLayout.svelte';
  import FomoCard from '$lib/features/fomo/score/FomoCard.svelte';
  import { fomoStore } from '$lib/features/fomo/stores/fomoStore';
  
  // Layout configuration using runes since it's component-specific
  let layout = $state({
    columns: 1,
    padding: 'normal',
    width: 'normal'
  } as const);

  const formatDateRange = (start: Date, end: Date): string => {
    const format = (d: Date) => d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    return `${format(start)} - ${format(end)}`;
  };

  const getFomoEmoji = (score: number): string => {
    if (score >= 80) return '🤯';
    if (score >= 60) return '🚀';
    if (score >= 40) return '👀';
    if (score >= 20) return '🤔';
    return '😴';
  };
</script>

<div class="min-h-screen">
  <Hero />
  
  <GridLayout {layout}>
    <div slot="controls" class="space-y-6">
      <Controls bind:layout />
    </div>

    <div slot="fomo">
      {#if $fomoStore.currentWeek}
        <FomoCard
          weekNumber={$fomoStore.currentWeek.weekNumber}
          dateRange={formatDateRange($fomoStore.currentWeek.startDate, $fomoStore.currentWeek.endDate)}
          score={$fomoStore.currentWeek.score}
          emoji={getFomoEmoji($fomoStore.currentWeek.score)}
          summary={$fomoStore.currentWeek.summary}
        />
      {/if}
    </div>

    <div slot="news">
      <News />
    </div>
  </GridLayout>
  
  <Timeline />
</div>