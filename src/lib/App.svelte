<!-- src/lib/App.svelte -->
<script lang="ts">
	import Hero from "./components/Hero.svelte";
	import Fomo from "./features/fomo/Fomo.svelte";
	import News from "./features/news/News.svelte";
	// import Analytics from "./features/analytics/Analytics.svelte";
	import Card from "./features/news/Card.svelte";
	import type { NewsItem } from "$lib/types";

	export let news: NewsItem[] | undefined = undefined;

	$: console.log("App received:", news?.length, "news items");
</script>

<!-- <Card item={news[0]} on:click={(item) => console.log('clicked:', item)} /> -->

{#if !news}
	<div class="p-4">Loading...</div>
{:else}
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
				<div class="opacity-20 text-center py-12 font-mono">// analytics</div>
				<!-- <Analytics /> -->
			</section>
		</main>
	</div>
{/if}
