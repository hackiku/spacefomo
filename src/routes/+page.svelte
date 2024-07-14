<!-- $routes/+page.svelte -->

<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import FomoMeter from "$lib/components/FomoMeter.svelte";

  let remainingTime = 12 * 13 * 59 * 1000; // 24 hours in milliseconds
  let currentScore = 185; // Placeholder FOMO score
</script>

<!-- <main class="relative flex flex-col items-center justify-center min-h-screen"> -->
<Hero />  
<FomoMeter {remainingTime} {currentScore} />

<!-- </main> -->
