<!-- src/routes/trpc-test/+page.svelte -->
<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import type { NewsItem } from '$lib/types/news';
  
  // State using runes
  let newsItems = $state<NewsItem[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  
  // Filter controls
  let fomoThreshold = $state(50);
  let filteredItems = $derived(
    newsItems.filter(item => {
      const score = typeof item.fomo_score === 'number'
        ? item.fomo_score
        : parseInt(String(item.fomo_score), 10);
      
      return !isNaN(score) && score >= fomoThreshold;
    })
  );
  
  // Load data when component mounts
  async function loadNews() {
    isLoading = true;
    error = null;
    
    try {
      const result = await trpc().getNews.query({
        limit: 50,
        minScore: 0
      });
      
      newsItems = result.items;
      console.log(`Loaded ${newsItems.length} news items`);
    } catch (err) {
      console.error('Failed to load news:', err);
      error = err instanceof Error ? err.message : 'Unknown error loading news';
    } finally {
      isLoading = false;
    }
  }
  
  // Call loadNews when the component mounts
  $effect(() => {
    loadNews();
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">tRPC News Test</h1>
  
  <!-- Filter controls -->
  <div class="mb-8 p-4 bg-card/30 border border-border rounded-lg">
    <h2 class="text-lg font-medium mb-3">Filter Controls</h2>
    
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label for="fomo-slider" class="text-sm text-muted-foreground">
          FOMO Threshold: {fomoThreshold}
        </label>
        <span class="text-primary font-medium">
          {filteredItems.length} / {newsItems.length} items
        </span>
      </div>
      
      <input
        id="fomo-slider"
        type="range"
        min="0"
        max="100"
        step="1"
        bind:value={fomoThreshold}
        class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  </div>
  
  <!-- Loading state -->
  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin h-8 w-8 border-t-2 border-l-2 border-primary rounded-full mr-3"></div>
      <p class="text-muted-foreground">Loading news data...</p>
    </div>
  {:else if error}
    <div class="p-8 text-center border border-destructive/30 bg-destructive/10 rounded-lg">
      <p class="text-destructive">Error: {error}</p>
      <button 
        class="mt-4 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm" 
        on:click={loadNews}
      >
        Try Again
      </button>
    </div>
  {:else if filteredItems.length === 0}
    <div class="p-8 text-center border border-border bg-card/50 rounded-lg">
      <p class="text-muted-foreground">
        No news articles match the current threshold ({fomoThreshold})
      </p>
    </div>
  {:else}
    <!-- News grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each filteredItems as article (article.id)}
        <div class="p-5 rounded-lg border border-border bg-card/60 hover:bg-card transition-colors">
          <div class="flex justify-between items-start mb-3">
            <span class="text-xl font-semibold text-primary">{article.fomo_score || 0}</span>
            {#if article.publication_date}
              <span class="text-sm text-muted-foreground">
                {new Date(article.publication_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            {/if}
          </div>
          
          <h3 class="text-lg font-medium mb-3 line-clamp-2">
            {article.viral_title || article.title}
          </h3>
          
          <div class="mb-3">
            <span class="text-sm text-muted-foreground">{article.source || 'Unknown'}</span>
          </div>
          
          {#if article.tags?.length}
            <div class="flex flex-wrap gap-1.5">
              {#each article.tags.slice(0, 3) as tag}
                <span class="bg-muted px-2 py-0.5 text-xs text-muted-foreground/70">
                  #{tag}
                </span>
              {/each}
              {#if article.tags.length > 3}
                <span class="bg-muted px-2 py-0.5 text-xs text-muted-foreground/70">
                  +{article.tags.length - 3}
                </span>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- Debug info -->
  <div class="mt-12 p-4 bg-muted/20 border border-border rounded-lg">
    <h3 class="text-sm font-medium mb-2">Debug Info</h3>
    <pre class="text-xs text-muted-foreground overflow-auto">
      {JSON.stringify({
        newsCount: newsItems.length,
        filteredCount: filteredItems.length,
        threshold: fomoThreshold
      }, null, 2)}
    </pre>
  </div>
</div>