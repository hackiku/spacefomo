<!-- src/lib/features/news/layout/NewsGrid.svelte -->
<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { Pagination } from 'bits-ui';
  import { CaretLeft, CaretRight } from 'phosphor-svelte';
  import SmallCard from '../article/SmallCard.svelte';
  import NewsModal from './NewsModal.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import type { NewsItem } from '$lib/types/news';
  
  // Props for everything - receiving from NewsApp parent
  let { 
    columnCount,
    sidebarMode,
    fomoThreshold,
    startDate,
    endDate,
    selectedTags,
    isLoading,
    error,
    newsItems,
    totalCount,
    offset,
    limit,
    onFilterChange,
    onDataLoaded,
    onError,
    onLoadingChange
  } = $props<{
    columnCount: ColumnCount;
    sidebarMode: SidebarMode;
    fomoThreshold: number;
    startDate: Date | null;
    endDate: Date | null;
    selectedTags: string[];
    isLoading: boolean;
    error: string | null;
    newsItems: NewsItem[];
    totalCount: number;
    offset: number;
    limit: number;
    onFilterChange: (filters: any) => void;
    onDataLoaded: (data: any) => void;
    onError: (error: string) => void;
    onLoadingChange: (loading: boolean) => void;
  }>();
  
  // Derived values
  const hasMore = $derived(offset + limit < totalCount);
  const currentPage = $derived(Math.floor(offset / limit) + 1);
  const totalPages = $derived(Math.ceil(totalCount / limit));
  
  // Format dates for API
  const formatDateForApi = (date: Date | null) => {
    return date ? date.toISOString().split('T')[0] : undefined;
  };
  
  // Load news with filters
  async function loadNews(resetOffset = false) {
    const newOffset = resetOffset ? 0 : offset;
    
    onLoadingChange(true);
    
    try {
      const result = await trpc().news.getNews.query({
        minScore: fomoThreshold,
        offset: newOffset,
        limit: limit,
        dateStart: formatDateForApi(startDate),
        dateEnd: formatDateForApi(endDate),
        tags: selectedTags.length > 0 ? selectedTags : undefined
      });
      
      // FIXED: Always replace items, never append
      onDataLoaded({
        items: result.items, // Just use the new items, don't append
        totalCount: result.meta.totalCount,
        offset: newOffset
      });
      
      // Debug info
      console.log(`Loaded ${result.items.length} of ${result.meta.totalCount} items with threshold ${fomoThreshold}`);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to load news');
      console.error('Error loading news:', err);
    } finally {
      onLoadingChange(false);
    }
  }
  
  // Pagination handler - FIXED
function handlePageChange(page: number) {
  // Calculate the new offset
  const newOffset = (page - 1) * limit;
  offset = newOffset; // Update the offset
  
  // Scroll to top of the grid (optional, for better UX)
  window.scrollTo({ top: 300, behavior: 'smooth' });
  
  // Always do a fresh load for pagination changes
  loadNews(false);
}

  
  // Load initial data
  $effect(() => {
    loadNews(true);
  });
  
  // Watch for filter changes
	$effect(() => {
		// Reference the dependencies explicitly to track them
		console.log("Filters changed:", fomoThreshold, startDate, endDate, selectedTags);
		loadNews(true);
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
  <div class="space-y-6">
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
      
      <!-- Pagination component -->
      {#if totalCount > 0}
        <div class="flex justify-center mt-12">
          <Pagination.Root 
            count={totalCount} 
            perPage={limit}
            page={currentPage}
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