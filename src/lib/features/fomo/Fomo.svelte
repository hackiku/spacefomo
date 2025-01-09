<!-- src/lib/features/fomo/Fomo.svelte -->
<script lang="ts">
  import FomoCard from './FomoCard.svelte';
  import FomoScore from './FomoScore.svelte';
  import WeekTimeline from './WeekTimeline.svelte';
  import { fomoStore } from '$lib/stores/fomoStore';

  $: currentWeek = $fomoStore.weeks[$fomoStore.currentWeekIndex];
</script>

<div class="relative -mt-16">
  <!-- Card positioned above timeline -->
  <div class="container max-w-6xl mx-auto">
    <div class="md:w-96 w-full md:ml-auto">
      <FomoCard>
        <FomoScore score={currentWeek.score} stats={currentWeek.stats} />
      </FomoCard>
    </div>
  </div>
  
  <!-- Timeline section - overlap the card's bottom -->
  <div class="bg-zinc-900/80 backdrop-blur-sm border-t border-white/10 -mt-4">
    <div class="container max-w-6xl mx-auto">
      <WeekTimeline />
    </div>
  </div>
</div>