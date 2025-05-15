<!-- src/lib/features/news/feed/NewsGrid.svelte -->
<script lang="ts">
  import { useNews } from '$lib/hooks';
  import SmallCard from '../article/SmallCard.svelte';
  import NewsModal from './NewsModal.svelte';
  // import SidebarToggle from '../layout/SidebarToggle.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import type { NewsItem } from '$lib/types/news';
  
  let { 
    columnCount = $bindable<ColumnCount>(1),
    sidebarMode = $bindable<SidebarMode>('default')
  } = $props();
  
  // Use the hook for data fetching
  const { items, isLoading, setActiveItem, error } = useNews();
  
  // Modal state
  let modalOpen = $state(false);
  let currentArticle = $state<NewsItem | null>(null);
  
  // Modal control functions
  function openModal(article: NewsItem) {
    currentArticle = article;
	  setActiveItem(article.id);  // Update in the context too
    modalOpen = true;
  }
  
  function closeModal() {
    modalOpen = false;
  }
</script>

<div class="w-full">
  <!-- SidebarToggle positioned inside the grid -->
  <!-- <SidebarToggle bind:sidebarMode bind:columnCount /> -->
  
  <!-- News content with appropriate spacing -->
  <div class="space-y-6 pt-4">
    {#if isLoading}
      <div class="p-8 text-center border border-border bg-card/50 backdrop-blur-sm">
        <div class="flex justify-center items-center">
          <div class="animate-spin h-6 w-6 border-t-2 border-l-2 border-primary rounded-full mr-3"></div>
          <p class="text-muted-foreground">Loading news articles...</p>
        </div>
      </div>
    {:else if error}
      <div class="p-8 text-center border border-destructive/30 bg-destructive/10 backdrop-blur-sm">
        <p class="text-destructive">Error loading news: {error}</p>
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
      <div class="p-8 text-center border border-border bg-card/50 backdrop-blur-sm">
        <p class="text-muted-foreground">No news articles available</p>
      </div>
    {/if}
  </div>
  
  <!-- Modal using bits-ui Dialog -->
  <NewsModal 
    article={currentArticle} 
    isOpen={modalOpen} 
    onClose={closeModal} 
  />
</div>