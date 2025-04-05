<!-- src/routes/news/[slug]/SlugSidebar.svelte -->
<script lang="ts">
	import { Copy, Link } from 'phosphor-svelte';
	import type { NewsItem } from '$lib/types/news';
	
	// Import local components
	import FomoScore from './FomoScore.svelte';
	import ArticleButtons from './ArticleButtons.svelte';
	import ArticleTags from '$lib/features/news/tags/ArticleTags.svelte';
	
	let { article } = $props<{
		article: NewsItem;
	}>();
</script>

<aside class="lg:w-72 space-y-6 lg:sticky lg:top-8">
	<!-- FOMO Score -->
	<FomoScore score={article.fomo_score || 0} impactScore={article.impact_score} />
	
	<!-- Tags -->
	{#if article.tags?.length}
		<ArticleTags tags={article.tags} />
	{/if}
	
	<!-- Action Buttons -->
	<ArticleButtons url={article.url} />
</aside>