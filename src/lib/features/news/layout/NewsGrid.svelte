<!-- src/lib/features/news/layout/NewsGrid.svelte -->
<script lang="ts">
  import { trpc } from '$lib/trpc/client';
	import { Pagination } from 'bits-ui';
	import { CaretLeft, CaretRight } from 'phosphor-svelte';
  import SmallCard from '../article/SmallCard.svelte';
  import NewsModal from './NewsModal.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import type { NewsItem } from '$lib/types/news';
  
  // Props for layout settings
  let { 
    columnCount = $bindable<ColumnCount>(1),
    sidebarMode = $bindable<SidebarMode>('default')
  } = $props();
  
  // Local state for news data and filtering
  let newsItems = $state<NewsItem[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let totalCount = $state(0);
  let offset = $state(0);
  let limit = $state(20);
  let hasMore = $state(false);
  
  // Filter state
  let fomoThreshold = $state(60);
  let startDate = $state<Date | null>(null);
  let endDate = $state<Date | null>(null);
  let selectedTags = $state<string[]>([]);
  
  // Format dates for API
  const formatDateForApi = (date: Date | null) => {
    return date ? date.toISOString().split('T')[0] : undefined;
  };
  
  // Load news with filters
  async function loadNews(reset = false) {
    if (reset) {
      offset = 0;
    }
    
    isLoading = true;
    
    try {
      const result = await trpc().news.getNews.query({
        minScore: fomoThreshold,
        offset: offset,
        limit: limit,
        dateStart: formatDateForApi(startDate),
        dateEnd: formatDateForApi(endDate),
        tags: selectedTags.length > 0 ? selectedTags : undefined
      });
      
      if (reset) {
        newsItems = result.items;
      } else {
        // Append new items
        newsItems = [...newsItems, ...result.items];
      }
      
      // Update pagination info
      totalCount = result.meta.totalCount;
      hasMore = offset + limit < totalCount;
      
      // Debug info
      console.log(`Loaded ${newsItems.length} of ${totalCount} items with threshold ${fomoThreshold}`);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load news';
      console.error('Error loading news:', err);
    } finally {
      isLoading = false;
    }
  }
  
  // Load more items
  function loadMore() {
    if (isLoading || !hasMore) return;
    offset += limit;
    loadNews(false);
  }
  
  // Set FOMO threshold and reload data
  function setFomoThreshold(value: number) {
    if (fomoThreshold !== value) {
      fomoThreshold = value;
      loadNews(true); // Reset and reload
    }
  }

  function handlePageChange(page: number) {
    offset = (page - 1) * limit;
    loadNews(false);
  }

  
  // Log FOMO scores for debugging
  $effect(() => {
    console.log('News items FOMO scores:', 
      newsItems?.map(item => ({
        id: item.id, 
        title: item.title?.slice(0, 20), 
        fomo_score: item.fomo_score
      }))
    );
  });
  
  // Load initial data
  $effect(() => {
    loadNews(true);
  });
  
	$effect(() => {
  function handleFiltersChanged(e: CustomEvent) {
    if (e.detail?.fomoThreshold !== undefined && fomoThreshold !== e.detail.fomoThreshold) {
      fomoThreshold = e.detail.fomoThreshold;
      loadNews(true); // Reload with new threshold
    }
    
    if (e.detail?.startDate !== undefined || e.detail?.endDate !== undefined) {
      startDate = e.detail.startDate || null;
      endDate = e.detail.endDate || null;
      loadNews(true); // Reload with new dates
    }
    
    if (e.detail?.selectedTags !== undefined) {
      selectedTags = e.detail.selectedTags || [];
      loadNews(true); // Reload with new tags
    }
  }
  
  document.addEventListener('filtersChanged', handleFiltersChanged as EventListener);
  
  return () => {
    document.removeEventListener('filtersChanged', handleFiltersChanged as EventListener);
  };
});

  // Modal state
  let modalOpen = $state(false);
  let currentArticle = $state<NewsItem | null>(null);
  
  // Modal control functions
  function openModal(article: NewsItem) {
    currentArticle = article;
    modalOpen = true;
  }
  
  function closeModal() {
    modalOpen = false;
  }
</script>

<div class="w-full">
  <!-- News content with appropriate spacing -->
  <div class="space-y-6 pt-4">
    {#if isLoading && !newsItems.length}
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
    {:else if newsItems.length > 0}
      {#if columnCount === 1}
        <!-- Single column layout -->
        <div class="space-y-6">
          {#each newsItems as article (article.id)}
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
          {#each newsItems as article (article.id)}
            <SmallCard 
              article={article} 
              onSelect={() => openModal(article)}
            />
          {/each}
        </div>
      {/if}
      
      <!-- Load more button -->
      {#if hasMore}
        <div class="flex justify-center mt-8">
          <button
            type="button"
            class="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-md transition-colors"
            onclick={loadMore}
            disabled={isLoading}
          >
            {#if isLoading}
              <span class="flex items-center">
                <div class="animate-spin h-4 w-4 border-t-2 border-l-2 border-current rounded-full mr-2"></div>
                Loading...
              </span>
            {:else}
              Load More
            {/if}
          </button>
        </div>
      {/if}
    {:else}
      <div class="p-8 text-center border border-border bg-card/50 backdrop-blur-sm">
        <p class="text-muted-foreground">
          No news articles match the current threshold ({fomoThreshold})
        </p>
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



<!-- Add this at the bottom of NewsGrid.svelte -->
<!-- {#if newsItems.length > 0 && totalCount > limit} -->
  <div class="flex justify-center mt-12">
    <Pagination.Root 
      count={totalCount} 
      perPage={limit}
      page={Math.floor(offset / limit) + 1}
      onPageChange={handlePageChange}
    >
      {#snippet children({ pages, range })}
        <div class="flex items-center gap-2">
          <Pagination.PrevButton
            class="flex items-center justify-center h-10 w-10 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <CaretLeft class="h-4 w-4" />
          </Pagination.PrevButton>
          
          <div class="flex items-center gap-1">
            {#each pages as page (page.key)}
              {#if page.type === "ellipsis"}
                <div class="flex items-center justify-center h-10 w-10">
                  <span>...</span>
                </div>
              {:else}
                <Pagination.Page
                  {page}
                  class="flex items-center justify-center h-10 w-10 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors data-[selected]:bg-primary data-[selected]:text-primary-foreground"
                >
                  {page.value}
                </Pagination.Page>
              {/if}
            {/each}
          </div>
          
          <Pagination.NextButton
            class="flex items-center justify-center h-10 w-10 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <CaretRight class="h-4 w-4" />
          </Pagination.NextButton>
        </div>
        
        <p class="text-xs text-muted-foreground mt-2 text-center">
          Showing {range.start}-{range.end} of {totalCount} articles
        </p>
      {/snippet}
    </Pagination.Root>
  </div>
<!-- {/if} -->