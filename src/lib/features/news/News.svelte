<!-- src/lib/features/news/News.svelte -->
<script lang="ts">
  import { useNews } from '$lib/hooks';
  import SmallCard from './card/SmallCard.svelte';
  import NewsModal from './NewsModal.svelte';
  import type { ColumnCount } from '$lib/types/layout';
  
  let { columnCount } = $props<{
    columnCount: ColumnCount;
  }>();
  
  // Use the hook to get access to the news data
  const { items, activeItem, isLoading, error, setActiveItem } = useNews();
  
  // Add a debugging $effect
  $effect(() => {
    if (activeItem) {
      console.log('News activeItem changed:', activeItem);
    }
  });
</script>

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
            <SmallCard article={article} />
          </div>
        {/each}
      </div>
    {:else}
      <!-- Two-column grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each items as article (article.id)}
          <SmallCard article={article} />
        {/each}
      </div>
    {/if}
  {:else}
    <div class="p-8 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
      <p class="text-zinc-400">No news articles available</p>
    </div>
  {/if}
</div>


<!-- {#if activeItem}
  <div class="hidden">{console.log('About to render NewsModal with:', activeItem)}</div>
  <NewsModal article={activeItem} />
{/if} -->


{#if activeItem}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div class="bg-zinc-900 p-8 rounded-2xl max-w-3xl">
      <h2 class="text-xl text-white">Test Modal</h2>
      <p>Article ID: {activeItem.id}</p>
      <p>Title: {activeItem.title}</p>
      <button 
        onclick={() => setActiveItem(null)}
        class="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
{/if}
