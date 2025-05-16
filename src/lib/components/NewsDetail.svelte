<!-- src/lib/components/NewsDetail.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';
  
  export let newsId: number;
  
  // Component state
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let newsItem = $state(null);
  
  // Load the news item when the component mounts
  $effect(() => {
    loadNewsItem(newsId);
  });
  
  async function loadNewsItem(id: number) {
    isLoading = true;
    error = null;
    
    try {
      // Use tRPC to fetch the news item
      newsItem = await trpc(page).getNewsById.query(id);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load news item';
    } finally {
      isLoading = false;
    }
  }
</script>

{#if isLoading}
  <div class="loading">Loading...</div>
{:else if error}
  <div class="error">{error}</div>
{:else if newsItem}
  <article>
    <h2>{newsItem.title}</h2>
    <div class="meta">
      <span class="source">{newsItem.source}</span>
      <span class="score">FOMO: {newsItem.fomo_score}</span>
    </div>
    <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
      Read More
    </a>
  </article>
{:else}
  <div>No news item found</div>
{/if}