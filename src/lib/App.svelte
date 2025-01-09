<!-- src/lib/App.svelte -->
<script lang="ts">
	import Hero from './components/Hero.svelte';
  import Fomo from './features/fomo/Fomo.svelte';
  import News from './features/news/News.svelte';
	// import Analytics from './features/analytics/Analytics.svelte';
</script>

<div class="relative overflow-hidden min-h-screen">
  <main class="relative z-10">
    <Hero />
    <Fomo />
    <div class="bg-zinc-900/80">
      <News />
    </div>
  </main>
</div>