<!-- src/lib/features/news/News.svelte -->
<script lang="ts">
  import { newsStore } from '$lib/stores/newsStore';
  import SmallCard from './card/SmallCard.svelte';
  import NewsModal from './NewsModal.svelte';
  
  const store = $derived($newsStore);
  const items = $derived(store.items || []);
  const activeArticle = $derived(items.find(a => a.id === store.activeItemId));
</script>

<div class="grid gap-6">
  {#each items as article (article.id)}
    <SmallCard {article} />
  {/each}
</div>

{#if activeArticle}
  <NewsModal article={activeArticle} />
{/if}