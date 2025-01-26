<!-- src/lib/App.svelte -->
<script lang="ts">
	import Hero from './components/Hero.svelte';
  import Fomo from './features/fomo/Fomo.svelte';
  import News from './features/news/News.svelte';
	import Analytics from './features/analytics/Analytics.svelte';
	
  import Card from './features/news/Card.svelte';

	export let news;
</script>

{#if news?.[0]}
  <div class="p-4">
    <Card item={news[0]} on:click={(item) => console.log('clicked:', item)} />
  </div>
{/if}


<div class="relative overflow-hidden min-h-screen">
  <main class="relative z-10">
    <section>
			<Hero />
		</section>
    <section>
			<Fomo />
		</section>
    <section>
			<News />
		</section>
    <section>
			<Analytics />
		</section>
  </main>
</div>

