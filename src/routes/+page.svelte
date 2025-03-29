<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from '$lib/layout/Hero.svelte';
  import GridLayout from '$lib/layout/GridLayout.svelte';
  // import Timeline from '$lib/features/fomo/Timeline.svelte';
	import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
  import type { PageData } from './$types';
  // import type { LayoutLoad } from './$types';
  // let { data } = $props<PageData>();
  // let { data } = $props();
</script>

<ViewportSize />

<div class="flex min-h-screen flex-col">
  <section class="relative overflow-hidden border-white/10 bg-black/40 pt-24 pb-20 sm:pt-32 sm:pb-24">
    <Hero />
  </section>
  
	<section class="relative">
    <div class="pointer-events-none absolute top-0 left-0 -z-10 h-56 w-full bg-gradient-to-b from-black/40 to-transparent"></div>
    <GridLayout />
  </section>
  <!-- <Timeline /> -->
</div>