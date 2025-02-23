<!-- src/lib/features/news/News.svelte -->
<script lang="ts">
  import { newsStore } from '$lib/stores/newsStore';
  import SmallCard from './card/SmallCard.svelte';
  import BigCard from './card/BigCard.svelte';
  
  // For now, using the mock data from the store
  const news = Array(10).fill(null).map((_, i) => ({
    id: i,
    title: `AerospaceUX launches Moonship to orbit for the first time`,
    source: 'Space.com',
    readTime: 2,
    score: 85 - (i * 3), 
    url: 'https://example.com',
    tags: ['launch', 'spacex'],
    weekId: 5,
    createdAt: new Date()
  }));

  let activeArticle = $derived(news.find(a => a.id === $newsStore.activeItemId));
</script>

<div class="grid gap-6">
  {#each news as article (article.id)}
    <SmallCard {article} />
  {/each}
</div>

{#if activeArticle}
  <BigCard article={activeArticle} />
{/if}