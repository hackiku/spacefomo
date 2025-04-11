<!-- src/routes/news/+page.svelte -->
<script lang="ts">
  import { fetchNewsFromSupabaseFunction } from './newsApiService';
  import { onMount } from 'svelte';

  // Use runes for reactivity
  let news = $state([]);
  let loading = $state(true);
  let error = $state(null);

  // Function to load news articles
  async function loadNews() {
    try {
      loading = true;
      error = null;
      
      const result = await fetchNewsFromSupabaseFunction({
        limit: 10,
        sortBy: 'fomo_score',
        sortDir: 'desc',
        minScore: 50
      });
      
      news = result.data;
    } catch (err) {
      console.error('Failed to load news:', err);
      error = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      loading = false;
    }
  }

  // Load news when component mounts
  onMount(loadNews);
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Space News</h1>
  
  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Error: {error}</p>
      <button 
        class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
        on:click={loadNews}
      >
        Try Again
      </button>
    </div>
  {:else if news.length === 0}
    <p class="text-center text-gray-500">No news articles found.</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each news as article}
        <div class="border rounded-lg p-4 hover:shadow-md transition">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-semibold mb-2">{article.title}</h2>
            <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Score: {article.fomo_score}
            </span>
          </div>
          
          {#if article.summary}
            <p class="text-gray-600 mb-3">{article.summary}</p>
          {/if}
          
          <div class="flex justify-between items-center mt-4">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-blue-500 hover:text-blue-700"
            >
              Read Original
            </a>
            
            {#if article.source}
              <span class="text-xs text-gray-500">Source: {article.source}</span>
            {/if}
          </div>
          
          {#if article.tags && article.tags.length > 0}
            <div class="mt-3 flex flex-wrap gap-1">
              {#each article.tags as tag}
                <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>