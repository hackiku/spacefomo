<!-- src/lib/features/fomo/Fomo.svelte -->
<script lang="ts">
  import FomoCard from './FomoCard.svelte';
  import FomoScore from './FomoScore.svelte';
  import WeekTimeline from './WeekTimeline.svelte';
  import { fomoStore } from '$lib/stores/fomoStore';

  $: currentWeek = $fomoStore.weeks[$fomoStore.currentWeekIndex];
</script>

<section class="relative w-full bg-zinc-900/80 backdrop-blur-sm border-t border-white/10">
  <FomoCard position="right">
    <FomoScore score={currentWeek.score} stats={currentWeek.stats} />
  </FomoCard>

  <div class="container max-w-6xl mx-auto pt-16 lg:pt-8">
    <WeekTimeline />
  </div>
</section>
