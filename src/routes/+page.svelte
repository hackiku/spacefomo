<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import Timeline from '$lib/features/fomo/week/Timeline.svelte';
  import GridLayout from '$lib/layout/GridLayout.svelte';
</script>

<div class="min-h-screen">
  <Hero />
  <GridLayout />
  <Timeline />
</div>