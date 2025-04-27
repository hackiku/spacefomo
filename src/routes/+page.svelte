<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from '$lib/components/layout/Hero.svelte';
  // import NewsFeed from '$lib/components/layout/NewsFeed.svelte';
  // import NewsFeed from '$lib/features/news/NewsFeed.svelte';
  import NewsApp from '$lib/features/news/NewsApp.svelte';
  
	import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
  import D3Sphere from '$lib/features/dataviz/D3Sphere.svelte';
  // import type { PageData } from './$types';
  // import type { LayoutLoad } from './$types';
  // let { data } = $props<PageData>();
  // let { data } = $props();
</script>

<ViewportSize />

<div class="flex min-h-screen flex-col">
  <section class="relative overflow-hidden __border-white/10 __bg-black/40 pt-24 pb-20 sm:pt-32 sm:pb-24">
    <Hero />
  </section>
  
  <section class="relative">
		<div class="pointer-events-none absolute top-0 left-0 -z-10 h-56 w-full __bg-gradient-to-b from-black/40 to-transparent"></div>
    <NewsApp />
  </section>
  
  <!-- D3 Sphere visualization -->
	<section class="-z-10">
		<D3Sphere 
    	wireframeColor="rgba(168, 139, 250, 0.55)"
    	rotationSpeed={0.002}
		/>
	</section>
</div>