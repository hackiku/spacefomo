<!-- src/lib/features/news/News.svelte -->
<script lang="ts">
  import { newsStore } from '$lib/stores/newsStore';
  import SmallCard from './card/SmallCard.svelte';
  import NewsModal from './NewsModal.svelte';
  
  const store = $derived($newsStore);
  const items = $derived(store?.items || []);
  const activeArticle = $derived(items.find(a => a.id === store?.activeItemId));
</script>

<div class="w-full space-y-6">
  {#if items.length > 0}
    {#each items as article (article.id)}
      <SmallCard {article} />
    {/each}
  {:else}
    <div class="p-8 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
      <p class="text-zinc-400">No news articles available</p>
    </div>
  {/if}
</div>

{#if activeArticle}
  <NewsModal article={activeArticle} />
{/if}