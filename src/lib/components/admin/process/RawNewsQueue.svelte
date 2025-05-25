<!-- src/lib/components/admin/process/RawNewsQueue.svelte -->
<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { ArrowRight, MagnifyingGlass, FunnelSimple, SpinnerGap } from 'phosphor-svelte';
  import { cn } from '$lib/utils';
  import RawNewsCard from './RawNewsCard.svelte';
  import type { RawNewsItem } from '../types';
  
  // Props
  let { onSelect } = $props<{
    onSelect: (article: RawNewsItem) => void
  }>();
  
  // State
  let rawNews = $state<RawNewsItem[]>([]);
  let isLoading = $state(true);
  let loadError = $state<string | null>(null);
  let searchQuery = $state('');
  let filterType = $state('all');
  let processingItems = $state<string[]>([]);
  let selectedItems = $state<string[]>([]);
  let selectedProvider = $state('perplexity');
  
  // Pagination
  let page = $state(1);
  let limit = $state(10);
  let offset = $state(0);
  let totalCount = $state(0);
  
  // Load data using trpc
  async function loadRawNews() {
    isLoading = true;
    loadError = null;
    
    try {
      // Prepare options
      const status = filterType !== 'all' ? filterType : undefined;
      const sourceType = undefined; // Add this filter if needed
      const order = 'desc';
      
      // Call the TRPC procedure
      const result = await trpc().admin.getRawNewsQueue.query({
        status,
        sourceType,
        limit,
        offset,
        order
      });
      
      rawNews = result.items;
      totalCount = result.meta.totalCount;
    } catch (error) {
      console.error('Error loading raw news:', error);
      loadError = error instanceof Error ? error.message : 'Unknown error loading data';
    } finally {
      isLoading = false;
    }
  }
  
  // Process a single raw news item
  async function handleProcess(id: string, provider: string = selectedProvider) {
    processingItems = [...processingItems, id];
    
    try {
      // Process with TRPC
      const result = await trpc().admin.processRawNewsItem.mutate({
        id,
        provider
      });
      
      if (result.success) {
        await loadRawNews();
      } else {
        console.error('Error processing item:', result.error);
      }
    } catch (error) {
      console.error('Error processing item:', error);
    } finally {
      processingItems = processingItems.filter(itemId => itemId !== id);
    }
  }
  
  // Process batch
  async function handleProcessSelected() {
    if (selectedItems.length === 0) return;
    
    processingItems = [...processingItems, ...selectedItems];
    
    try {
      // Use TRPC batch mutation
      const result = await trpc().admin.processBatchRawNews.mutate({
        ids: selectedItems,
        provider: selectedProvider
      });
      
      if (result.success) {
        await loadRawNews();
        selectedItems = [];
      } else {
        console.error('Error processing batch:', result.error);
      }
    } catch (error) {
      console.error('Error processing batch:', error);
    } finally {
      processingItems = processingItems.filter(id => !selectedItems.includes(id));
    }
  }
  
  // Toggle item selection
  function toggleSelectItem(id: string) {
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(itemId => itemId !== id);
    } else {
      selectedItems = [...selectedItems, id];
    }
  }
  
  // Load initial data
  $effect(() => {
    loadRawNews();
  });
  
  // Filtered news based on search
  let filteredNews = $derived(
    rawNews.filter(item => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        (item.title?.toLowerCase().includes(query)) || 
        item.url.toLowerCase().includes(query) || 
        item.source_name?.toLowerCase().includes(query)
      );
    })
  );
</script>

<div class="rounded-default border border-border bg-card/60 backdrop-blur-sm">
  <div class="p-5 border-b border-border flex items-center justify-between">
    <h2 class="text-lg font-medium text-foreground">Raw News Queue</h2>
    
    <div class="flex items-center gap-3">
      <!-- Provider selector for batch processing -->
      <select 
        bind:value={selectedProvider}
        class="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-muted border border-border 
               text-sm text-muted-foreground focus:text-foreground
               focus:outline-none focus:ring-1 focus:ring-primary/50"
      >
        <option value="perplexity">Perplexity</option>
        <option value="anthropic">Claude</option>
        <option value="openai">GPT-4o</option>
      </select>
      
      <!-- Reload button -->
      <button
        onclick={() => loadRawNews()}
        class={cn(
          "p-2 rounded-lg transition-colors", 
          isLoading 
            ? "bg-primary/20 text-primary" 
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
        aria-label="Reload data"
      >
        <ArrowRight weight="bold" class={cn("h-5 w-5", isLoading && "animate-spin")} />
      </button>
    </div>
  </div>
  
  <!-- Search and filters -->
  <div class="p-4 border-b border-border grid grid-cols-1 md:grid-cols-5 gap-4">
    <!-- Search -->
    <div class="md:col-span-3">
      <div class="relative">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by title, URL or source..."
          class="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border
                 text-foreground placeholder:text-muted-foreground
                 focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <MagnifyingGlass class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>
    </div>
    
    <!-- Source Type Filter -->
    <div class="md:col-span-2">
      <div class="flex rounded-lg border border-border overflow-hidden">
        <button
          onclick={() => filterType = 'all'}
          class={cn(
            "flex-1 py-2 text-sm transition-colors",
            filterType === 'all' 
              ? "bg-primary/10 text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          All Sources
        </button>
        <button
          onclick={() => filterType = 'agent_research'}
          class={cn(
            "flex-1 py-2 text-sm transition-colors",
            filterType === 'agent_research' 
              ? "bg-primary/10 text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          AI Research
        </button>
        <button
          onclick={() => filterType = 'submission'}
          class={cn(
            "flex-1 py-2 text-sm transition-colors",
            filterType === 'submission' 
              ? "bg-primary/10 text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Submissions
        </button>
      </div>
    </div>
  </div>
  
  <!-- News list -->
  <div class="overflow-y-auto max-h-[60vh]">
    {#if isLoading}
      <div class="p-8 text-center">
        <SpinnerGap weight="duotone" class="h-12 w-12 text-primary mx-auto mb-3 animate-spin" />
        <p class="text-foreground">Loading news items...</p>
      </div>
    {:else if loadError}
      <div class="p-8 text-center border-dashed border border-red-500/30 bg-red-500/5 rounded-lg m-4">
        <p class="text-red-400">Error loading news: {loadError}</p>
        <button 
          onclick={() => loadRawNews()}
          class="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"
        >
          Try Again
        </button>
      </div>
    {:else if filteredNews.length === 0}
      <div class="p-8 text-center">
        <p class="text-muted-foreground">No articles match your search criteria.</p>
      </div>
    {:else}
      <ul class="divide-y divide-border">
        {#each filteredNews as item (item.id)}
          <RawNewsCard
            {item} 
            {onSelect} 
            onProcess={handleProcess} 
            isProcessing={processingItems.includes(item.id)} 
          />
        {/each}
      </ul>
    {/if}
  </div>
  
  <!-- Pagination and actions -->
  <div class="p-4 border-t border-border flex justify-between items-center">
    <span class="text-sm text-muted-foreground">
      {filteredNews.length} of {totalCount} articles
    </span>
    
    <div class="flex gap-2">
      {#if selectedItems.length > 0}
        <button 
          onclick={() => handleProcessSelected()}
          class="px-3 py-1.5 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors"
        >
          Process {selectedItems.length} Selected
        </button>
      {:else}
        <button class="px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground cursor-not-allowed">
          Select Items to Process
        </button>
      {/if}
    </div>
  </div>
</div>