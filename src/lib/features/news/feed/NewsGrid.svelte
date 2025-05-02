<!-- src/lib/features/news/feed/NewsGrid.svelte -->
<script lang="ts">
  import { useNews } from '$lib/hooks';
  import SmallCard from '../article/SmallCard.svelte';
  import NewsModal from './NewsModal.svelte';
  import type { ColumnCount } from '$lib/types/layout';
  import type { NewsItem } from '$lib/types/news';
  
  let { columnCount } = $props<{
    columnCount: ColumnCount;
  }>();
  
  // Use the hook just for data fetching
  const { items, isLoading, error } = useNews();
  
  // Local modal state
  let modalOpen = $state(false);
  let currentArticle = $state<NewsItem | null>(null);
  
  // Modal control functions
  function openModal(article: NewsItem) {
    console.log('Opening modal for article:', article.id);
    currentArticle = article;
    modalOpen = true;
  }
  
  function closeModal() {
    console.log('Closing modal');
    modalOpen = false;
  }
</script>

<div class="w-full space-y-6">
  {#if isLoading}
    <div class="p-8 text-center border border-zinc-800/50 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
      <p class="text-zinc-400">Loading news articles...</p>
    </div>
  {:else if error}
    <div class="p-8 text-center border border-red-800/50 bg-red-900/20 backdrop-blur-sm rounded-xl">
      <p class="text-red-400">Error loading news: {error}</p>
    </div>
  {:else if items.length > 0}
    {#if columnCount === 1}
      <!-- Single column layout -->
      <div class="space-y-6">
        {#each items as article (article.id)}
          <div class="mx-auto">
            <SmallCard 
              article={article} 
              onSelect={() => openModal(article)}
            />
          </div>
        {/each}
      </div>
    {:else}
      <!-- Two-column grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each items as article (article.id)}
          <SmallCard 
            article={article} 
            onSelect={() => openModal(article)}
          />
        {/each}
      </div>
    {/if}
  {:else}
    <div class="p-8 text-center border border-zinc-800/50 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
      <p class="text-zinc-400">No news articles available</p>
    </div>
  {/if}
  
  <!-- Modal -->
  <NewsModal 
    article={currentArticle} 
    isOpen={modalOpen} 
    onClose={closeModal} 
  />
</div>