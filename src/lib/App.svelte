<!-- src/lib/App.svelte -->
<script lang="ts">
	import Hero from './components/Hero.svelte';
  import Fomo from './features/fomo/Fomo.svelte';
  import News from './features/news/News.svelte';
	import Analytics from './features/analytics/Analytics.svelte';
  import Card from './features/news/Card.svelte';
	import type { NewsItem } from '$lib/types'

  export let news: NewsItem[] | undefined = undefined;
  export let error: string | undefined = undefined;
  
  $: console.log('App received:', news?.length, 'news items');
</script>

<!-- <div class="fixed top-0 h-44 z-50 bg-300"> -->

{#if error}
  <div class="p-4 text-red-500">
    
		{error}
  </div>
{:else if !news}
  <div class="p-4">
    Loading...
  </div>
{:else if news[0]}
  <div class="p-4">
    <Card item={news[0]} on:click={(item) => console.log('clicked:', item)} />
  </div>
{/if}
<!-- </div> -->
			<News />


<div class="relative overflow-hidden min-h-screen">
  <main class="relative z-10">





    <section>
			<Hero />
		</section>
    <section>
			<Fomo />
		</section>
    <section>
			<!-- <News /> -->
		</section>
    <section>
			<Analytics />
		</section>
  </main>
</div>

