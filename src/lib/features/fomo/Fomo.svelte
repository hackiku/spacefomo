<!-- src/lib/features/fomo/Fomo.svelte -->
<script lang="ts">
  import FomoScore from './FomoScore.svelte';
  import WeekTimeline from './WeekTimeline.svelte';
  import { fomoStore } from '$lib/stores/fomoStore';
</script>

<div class="relative container max-w-6xl mx-auto">
  <!-- Combined container -->
  <div class="relative">
    <!-- Score section -->
    <div class="relative rounded-t-2xl border border-b-0
                bg-white/30 dark:bg-black/30 backdrop-blur-sm 
                border-black/10 dark:border-white/10">
      <FomoScore />
    </div>

    <!-- Timeline section that merges with score -->
    <div class="relative -mt-px rounded-b-2xl border
                bg-white/30 dark:bg-black/30 backdrop-blur-sm
                border-black/10 dark:border-white/10
                opacity-80 hover:opacity-100 transition-opacity duration-300">
      <WeekTimeline />
    </div>
  </div>
</div>