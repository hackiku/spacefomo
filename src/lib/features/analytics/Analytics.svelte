<!-- src/lib/features/analytics/Analytics.svelte -->
<script lang="ts">
  import FomoCard from '../fomo/FomoCard.svelte';
  // import FomoScore from './FomoScore.svelte';
  // import WeekTimeline from './WeekTimeline.svelte';
  import { fomoStore } from '$lib/stores/fomoStore';

  $: currentWeek = $fomoStore.weeks[$fomoStore.currentWeekIndex];
</script>

<section class="relative w-full bg-zinc-900/80 backdrop-blur-sm border-t border-white/10">
  <FomoCard position="right">
    FomoCard
		<!-- <FomoScore score={currentWeek.score} stats={currentWeek.stats} /> -->
  </FomoCard>

  <!-- Timeline section that fills width -->
</section>