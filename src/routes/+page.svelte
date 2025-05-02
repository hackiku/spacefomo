<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from '$lib/components/layout/Hero.svelte';
  import NewsApp from '$lib/features/news/NewsApp.svelte';
  // import FomoApp from '$lib/features/fomo/FomoApp.svelte';
  import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
  import D3Sphere from '$lib/features/dataviz/D3Sphere.svelte';
</script>

<ViewportSize />

<div class="flex min-h-screen flex-col">
  <section class="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-24">
    <Hero />
  </section>
  
  <section class="relative flex-grow">
    <NewsApp />
  </section>
  
  <!-- Fixed FOMO App at bottom -->
	<!-- <div class="fixed bottom-0 left-0 right-0 z-50 h-16 bg-zinc-900/20 backdrop-blur-xs">
		<FomoApp />
	</div> -->
  
  <!-- Background D3 Sphere visualization -->
  <section class="fixed inset-0 -z-10">
    <D3Sphere 
      wireframeColor="rgba(168, 139, 250, 0.55)"
      rotationSpeed={0.002}
    />
  </section>
</div>