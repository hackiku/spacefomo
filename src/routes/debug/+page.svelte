<script lang="ts">
  import { onMount } from 'svelte';
  import { trpc } from '$lib/trpc/client';
  import type { NewsItem } from '$lib/types/news';

  // Simple state
  let newsItems = $state<NewsItem[]>([]);
  let isLoading = $state(true);
  let fomoThreshold = $state(60);

  // Filtered items (no complex context chaining)
  let filteredItems = $derived(
    newsItems.filter(item => {
      const score = typeof item.fomo_score === 'number'
        ? item.fomo_score
        : parseInt(String(item.fomo_score), 10);
      
      return !isNaN(score) && score >= fomoThreshold;
    })
  );

  // Load news directly
  async function loadNews() {
    try {
      const result = await trpc().getNews.query({
        limit: 50,
        minScore: 0
      });
      
      newsItems = result.items;
      console.log(`Loaded ${newsItems.length} items directly`);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadNews();
  });
</script>

<div class="container mx-auto py-8 px-4">
  <h1 class="text-2xl font-bold mb-6">Debug Test</h1>
  
  <div class="mb-8">
    <label class="block mb-2">
      FOMO Threshold: {fomoThreshold}
      <input 
        type="range" 
        min="0" 
        max="100" 
        bind:value={fomoThreshold} 
        class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </label>
    
    <p class="mt-2">
      Showing {filteredItems.length} of {newsItems.length} items
    </p>
  </div>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else if filteredItems.length === 0}
    <p>No news match the current filter settings</p>
  {:else}
    <div class="grid gap-4">
      {#each filteredItems as item (item.id)}
        <div class="p-4 border border-border bg-card/60 rounded-md">
          <div class="flex justify-between mb-2">
            <span class="text-lg font-semibold text-primary">{item.fomo_score}</span>
            <span class="text-sm text-muted-foreground">
              {#if item.publication_date}
                {new Date(item.publication_date).toLocaleDateString()}
              {/if}
            </span>
          </div>
          <h2 class="text-lg font-medium">{item.title}</h2>
          <p class="text-sm text-muted-foreground mt-1">{item.source || 'Unknown'}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>