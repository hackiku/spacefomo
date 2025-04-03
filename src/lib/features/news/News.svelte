<!-- src/lib/features/news/News.svelte -->
<script lang="ts">
  import { useNews } from '$lib/hooks';
  import SmallCard from './card/SmallCard.svelte';
  import NewsModal from './NewsModal.svelte';
  import type { ColumnCount } from '$lib/types/layout';
  
  let { columnCount } = $props<{
    columnCount: ColumnCount;
  }>();
  
  // Use the hook instead of directly accessing the store
  const { items, activeItem, isLoading, error } = useNews();
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
      <!-- Single column layout: cards get natural width with side margins -->
      <div class="space-y-6">
        {#each items as article (article.id)}
          <div class="mx-auto">
            <SmallCard article={article} />
          </div>
        {/each}
      </div>
    {:else}
      <!-- Two-column grid for larger screens -->
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

{#if activeItem}
  <NewsModal article={activeItem} />
{/if}