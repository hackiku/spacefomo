<!-- src/routes/admin/ArticleQueue.svelte -->
<script lang="ts">
  import { ArrowRight, MagnifyingGlass, Plus } from 'phosphor-svelte';
  
  let { onSelect } = $props<{
    onSelect: (article: any) => void
  }>();
  
  // Mock data for UI design
  let articles = $state([
    {
      id: 1,
      url: 'https://www.space.com/spacex-starship-orbital-test-flight-success',
      source: 'Space.com',
      submitted_at: new Date().toISOString(),
      status: 'pending',
      fomo_score: null
    },
    {
      id: 2,
      url: 'https://arstechnica.com/space/2025/03/nasa-confirms-plan-for-a-lunar-space-station/',
      source: 'Ars Technica',
      submitted_at: new Date(Date.now() - 86400000).toISOString(),
      status: 'pending',
      fomo_score: null
    },
    {
      id: 3,
      url: 'https://www.nasaspaceflight.com/2025/02/blue-origin-new-glenn-ready/',
      source: 'NASA Spaceflight',
      submitted_at: new Date(Date.now() - 172800000).toISOString(),
      status: 'pending',
      fomo_score: null
    }
  ]);
  
  let searchQuery = $state('');
  let showAddArticleForm = $state(false);
  let newArticleUrl = $state('');
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  function addArticle() {
    if (!newArticleUrl) return;
    
    articles = [
      {
        id: articles.length + 1,
        url: newArticleUrl,
        source: formatUrl(newArticleUrl).split('/')[0],
        submitted_at: new Date().toISOString(),
        status: 'pending',
        fomo_score: null
      },
      ...articles
    ];
    
    newArticleUrl = '';
    showAddArticleForm = false;
  }
  
  function handleSubmit(e: Event) {
    e.preventDefault();
    addArticle();
  }
  
  // Simple URL formatter for mockup
  function formatUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }
  
  let filteredArticles = $derived(searchQuery 
    ? articles.filter(a => a.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.source.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles);
</script>

<div class="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden h-full">
  <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
    <h2 class="font-medium text-zinc-200">Article Queue</h2>
    
    <button
      onclick={() => showAddArticleForm = !showAddArticleForm}
      class="p-2 rounded-lg text-sm flex items-center gap-1.5
             {showAddArticleForm ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'} 
             transition-colors"
    >
      <Plus weight="bold" class="h-4 w-4" />
      <span>Add Article</span>
    </button>
  </div>
  
  {#if showAddArticleForm}
    <div class="p-4 bg-zinc-800/50 border-b border-zinc-700/50">
      <form onsubmit={handleSubmit} class="flex gap-3">
        <div class="flex-1">
          <input
            type="url"
            bind:value={newArticleUrl}
            placeholder="Enter article URL"
            class="w-full px-3 py-2 bg-black/20 rounded-lg border border-zinc-700
                   text-zinc-200 placeholder:text-zinc-600
                   focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg"
        >
          Add
        </button>
      </form>
    </div>
  {/if}
  
  <div class="p-4 border-b border-zinc-800">
    <div class="relative">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search articles..."
        class="w-full pl-10 pr-4 py-2 bg-black/20 rounded-lg border border-zinc-800
               text-zinc-200 placeholder:text-zinc-600
               focus:outline-none focus:ring-1 focus:ring-zinc-700"
      />
      <MagnifyingGlass class="absolute left-3 top-2.5 h-5 w-5 text-zinc-600" />
    </div>
  </div>
  
  <div class="overflow-y-auto max-h-[60vh]">
    {#if filteredArticles.length === 0}
      <div class="p-8 text-center text-zinc-500">
        No articles found. Add some to get started.
      </div>
    {:else}
      <ul class="divide-y divide-zinc-800">
        {#each filteredArticles as article (article.id)}
          <li class="p-4 hover:bg-zinc-800/30 transition-colors">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-zinc-300 truncate">{formatUrl(article.url)}</p>
                <div class="flex items-center gap-3 mt-1 text-sm">
                  <span class="text-zinc-500">{article.source}</span>
                  <span class="text-zinc-600">•</span>
                  <span class="text-zinc-500">{formatDate(article.submitted_at)}</span>
                </div>
              </div>
              
              <button
                onclick={() => onSelect(article)}
                class="ml-4 flex-shrink-0 p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20
                       text-violet-400 hover:text-violet-300 transition-colors"
                aria-label="Process this article"
              >
                <ArrowRight weight="bold" class="h-5 w-5" />
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  <div class="p-4 border-t border-zinc-800 flex justify-between items-center text-sm">
    <span class="text-zinc-500">{filteredArticles.length} articles</span>
    
    <div class="flex items-center gap-2">
      <button class="px-2 py-1 text-zinc-400 hover:text-zinc-200 transition-colors">
        Previous
      </button>
      <span class="text-zinc-500">Page 1</span>
      <button class="px-2 py-1 text-zinc-400 hover:text-zinc-200 transition-colors">
        Next
      </button>
    </div>
  </div>
</div>