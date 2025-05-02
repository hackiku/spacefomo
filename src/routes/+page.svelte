<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from '$lib/components/content/Hero.svelte';
  import NewsApp from '$lib/features/news/NewsApp.svelte';
  // import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
  import D3Sphere from '$lib/features/dataviz/D3Sphere.svelte';
</script>

<!-- <ViewportSize /> -->

<div class="flex min-h-screen flex-col">
  <section class="relative overflow-hidden py-30 sm:pt-36 sm:pb-30">
    <Hero />
  </section>
  
  <!-- <section class="relative flex-grow"> -->
    <NewsApp />
  <!-- </section> -->
  
  <!-- Background D3 Sphere visualization -->
  <section class="fixed inset-0 -z-10">
    <D3Sphere 
      wireframeColor="rgba(168, 139, 250, 0.55)"
      rotationSpeed={0.002}
    />
  </section>
</div>