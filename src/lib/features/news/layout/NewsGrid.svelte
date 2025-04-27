<!-- src/lib/features/news/NewsGrid.svelte -->
<script lang="ts">
  import { useNews } from '$lib/hooks';
  import SmallCard from '../article/SmallCard.svelte';
  import BigCard from '../article/BigCard.svelte';
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
  
  // Handle escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && modalOpen) {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="w-full space-y-6">
  {#if isLoading}
    <div class="p-8 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
      <p class="text-zinc-400">Loading news articles...</p>
    </div>
  {:else if error}
    <div class="p-8 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
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
    <div class="p-8 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
      <p class="text-zinc-400">No news articles available</p>
    </div>
  {/if}
</div>

<!-- Modal with BigCard -->
{#if modalOpen && currentArticle}
  <div 
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4"
  >
    <button
      type="button"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm"
      onclick={closeModal}
      aria-label="Close modal"
    >
    </button>

    <div class="relative w-full max-w-7xl pt-8">
      <BigCard article={currentArticle} />
    </div>
  </div>
{/if}