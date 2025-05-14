<!-- src/routes/admin/process/RawNewsQueue.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { ArrowRight, MagnifyingGlass, FunnelSimple, Pulse, Clock, Globe, SpinnerGap, Bug } from 'phosphor-svelte';
  import { fetchRawNews, processRawNews, processBatchRawNews, getMockRawNews } from '../api/rawNewsService';
  import type { RawNewsItem } from '../api/rawNewsService';
  import { getSupabaseClient } from '../api/supabaseClient';
  import { cn } from '$lib/utils';
  
  // Props
  let { onSelect } = $props<{
    onSelect: (article: any) => void
  }>();
  
  // State
  let rawNews = $state<RawNewsItem[]>([]);
  let isLoading = $state(true);
  let loadError = $state<string | null>(null);
  let searchQuery = $state('');
  let filterType = $state('all');
  let sortBy = $state('newest');
  let processingItems = $state<string[]>([]);
  let selectedItems = $state<string[]>([]);
  let selectedProvider = $state('perplexity');
  let useMockData = $state(false);
  let debugMode = $state(true); // Enable debug mode by default
  
  // Debug info
  let debugInfo = $state({
    lastLoadTime: '',
    dataCount: 0,
    filteredCount: 0,
    itemSample: null as any
  });
  
  // Effect to load data and setup realtime subscription
  $effect(() => {
    if (!browser) return;
    
    console.log('Setting up initial data load');
    loadRawNews();
    
    // Only set up subscription if we're not in mock mode
    if (!useMockData) {
      setupRealtimeUpdates();
    }
  });
  
  // Setup realtime updates
  function setupRealtimeUpdates() {
    if (!browser) return;
    
    try {
      const client = getSupabaseClient();
      if (!client) {
        console.error('No Supabase client available for realtime updates');
        return;
      }
      
      console.log('Setting up realtime subscription');
      
      // Subscribe to raw_news table changes
      const channel = client
        .channel('raw_news_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'raw_news' }, 
            (payload) => {
              console.log('Table changed:', payload);
              // Reload data when table changes
              loadRawNews();
            })
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });
    } catch (error) {
      console.error('Error setting up realtime updates:', error);
    }
  }
  
  // Load raw news data
  async function loadRawNews() {
    console.log('Loading raw news data...');
    isLoading = true;
    loadError = null;
    
    try {
      let result: RawNewsItem[] = [];
      
      if (useMockData) {
        // Use mock data for testing
        console.log('Using mock data');
        result = getMockRawNews();
        debugInfo.itemSample = result.length > 0 ? result[0] : null;
      } else {
        // Load real data from Supabase
        const order = sortBy === 'newest' ? 'desc' : 'asc';
        const statusFilter = filterType === 'all' ? undefined : filterType;
        
        console.log('Fetching real data with:', { order, statusFilter });
        const data = await fetchRawNews({
          limit: 50,
          status: statusFilter,
          order
        });
        
        // Store the result
        result = data;
        debugInfo.itemSample = data.length > 0 ? data[0] : null;
      }
      
      // Log the result for debugging
      console.log(`Loaded ${result.length} raw news items:`, result);
      
      // Update the state
      rawNews = result;
      
      // Update debug info
      debugInfo.lastLoadTime = new Date().toLocaleTimeString();
      debugInfo.dataCount = result.length;
      
    } catch (error) {
      console.error('Error loading raw news:', error);
      loadError = error instanceof Error ? error.message : 'Unknown error loading data';
    } finally {
      isLoading = false;
    }
  }
  
  // Process a single raw news item
  async function handleProcess(item: RawNewsItem) {
    processingItems = [...processingItems, item.id];
    
    try {
      const result = await processRawNews(item.id, selectedProvider);
      
      if (result.success) {
        // Item processing was successful
        await loadRawNews(); // Reload news items to get updated status
      } else {
        console.error('Error processing item:', result.error);
        // Could show an error toast here
      }
    } catch (error) {
      console.error('Error in process handler:', error);
    } finally {
      processingItems = processingItems.filter(id => id !== item.id);
    }
  }
  
  // Process all selected items
  async function handleProcessSelected() {
    if (selectedItems.length === 0) return;
    
    // Mark all selected items as processing
    processingItems = [...processingItems, ...selectedItems];
    
    try {
      const result = await processBatchRawNews(selectedItems, selectedProvider);
      
      if (result.success) {
        // Batch processing was successful
        await loadRawNews(); // Reload news items to get updated status
        selectedItems = []; // Clear selection
      } else {
        console.error('Error processing batch:', result.error);
      }
    } catch (error) {
      console.error('Error in batch process handler:', error);
    } finally {
      // Remove all selected items from processing status
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
  
  // Toggle mock data
  function toggleMockData() {
    useMockData = !useMockData;
    loadRawNews();
  }
  
  // Toggle debug mode
  function toggleDebugMode() {
    debugMode = !debugMode;
  }
  
  // Compute filtered news
  function computeFilteredNews() {
    if (!rawNews || !rawNews.length) return [];
    
    let filtered = [...rawNews];
    
    // Apply source type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.source_type === filterType);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.title?.toLowerCase().includes(query)) || 
        item.url.toLowerCase().includes(query) || 
        item.source_name?.toLowerCase().includes(query)
      );
    }
    
    // Update debug info
    debugInfo.filteredCount = filtered.length;
    
    return filtered;
  }
  
  // Important: Using a manual computation rather than $derived to rule out reactivity issues
  let filteredNews = $state<RawNewsItem[]>([]);
  
  // Update filtered news whenever relevant dependencies change
  $effect(() => {
    filteredNews = computeFilteredNews();
    console.log(`Filtered news updated: ${filteredNews.length} items`);
  });
  
  // Format relative time
  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  }
  
  // Format source type
  function getSourceLabel(type: string) {
    switch(type) {
      case 'agent_research': return 'AI Research';
      case 'submission': return 'User Submission';
      default: return type;
    }
  }
  
  // Format source type badge color
  function getSourceTypeColor(type: string) {
    switch(type) {
      case 'agent_research': 
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'submission': 
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      default: 
        return 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30';
    }
  }
  
  // Get status badge color
  function getStatusColor(status: string) {
    switch(status) {
      case 'pending': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'processing': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'processed': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'error': return 'bg-red-500/10 text-red-300 border-red-500/30';
      default: return 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30';
    }
  }
</script>

<div class="rounded-default border border-border bg-card/60 backdrop-blur-sm">
  <div class="p-5 border-b border-border flex flex-wrap items-center justify-between gap-4">
    <h2 class="text-lg font-medium text-foreground">Raw News Queue</h2>
    
    <div class="flex items-center gap-3">
      <!-- Debug toggle -->
      <button
        onclick={() => toggleDebugMode()}
        class={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors",
          debugMode 
            ? "bg-purple-500/20 text-purple-400" 
            : "bg-muted text-muted-foreground"
        )}
      >
        <Bug weight="bold" class="h-4 w-4" />
        <span>{debugMode ? 'Debug Mode' : 'Debug'}</span>
      </button>
      
      <!-- Mock data toggle -->
      <button
        onclick={() => toggleMockData()}
        class={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors",
          useMockData 
            ? "bg-amber-500/20 text-amber-400" 
            : "bg-muted text-muted-foreground"
        )}
      >
        <Bug weight="bold" class="h-4 w-4" />
        <span>{useMockData ? 'Using Mock Data' : 'Use Mock Data'}</span>
      </button>
      
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
  
  <!-- Debug Panel -->
  {#if debugMode}
    <div class="p-4 bg-purple-950/30 border-b border-purple-900/50 text-sm">
      <h3 class="text-purple-300 font-medium mb-2">Debug Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-purple-200">Raw Data Count: {debugInfo.dataCount}</p>
          <p class="text-purple-200">Filtered Count: {debugInfo.filteredCount}</p>
          <p class="text-purple-200">Last Load: {debugInfo.lastLoadTime}</p>
          <p class="text-purple-200 mt-2">Current Filters:</p>
          <pre class="text-xs text-purple-300 bg-purple-900/30 p-2 rounded mt-1 overflow-auto max-h-20">
            Type: {filterType}
            Query: {searchQuery}
            Sort: {sortBy}
          </pre>
        </div>
        <div>
          <p class="text-purple-200">Sample Item:</p>
          <pre class="text-xs text-purple-300 bg-purple-900/30 p-2 rounded mt-1 overflow-auto max-h-36">
            {debugInfo.itemSample ? JSON.stringify(debugInfo.itemSample, null, 2) : 'None'}
          </pre>
        </div>
      </div>
    </div>
  {/if}
  
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
  
  <div class="overflow-y-auto max-h-[60vh]">
    {#if isLoading}
      <div class="p-8 text-center">
        <SpinnerGap weight="duotone" class="h-12 w-12 text-primary mx-auto mb-3 animate-spin" />
        <p class="text-foreground">Loading news items...</p>
      </div>
    {:else if loadError}
      <div class="p-8 text-center">
        <Bug weight="duotone" class="h-12 w-12 text-red-400 mx-auto mb-3" />
        <p class="text-red-400 font-medium mb-2">Error loading raw news</p>
        <p class="text-muted-foreground text-sm mb-4">{loadError}</p>
        <div class="flex justify-center gap-3">
          <button 
            onclick={() => loadRawNews()}
            class="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Try Again
          </button>
          <button 
            onclick={() => toggleMockData()}
            class="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-sm text-primary transition-colors"
          >
            {useMockData ? 'Go back to real data' : 'Use mock data instead'}
          </button>
        </div>
      </div>
    {:else if filteredNews.length === 0}
      <div class="p-8 text-center">
        <Pulse weight="duotone" class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p class="text-muted-foreground">No articles found.</p>
        <p class="text-sm text-muted-foreground/80 mt-1">Try adjusting your filters or search query.</p>
        
        <!-- Raw data count display -->
        {#if debugMode && rawNews.length > 0}
          <div class="mt-4 p-4 bg-amber-900/30 border border-amber-800/30 rounded-lg inline-block">
            <p class="text-amber-400">Data exists but filter returned no results!</p>
            <p class="text-amber-300 text-sm mt-1">Raw data count: {rawNews.length}</p>
          </div>
        {/if}
        
        {#if !useMockData}
          <button 
            onclick={() => toggleMockData()}
            class="mt-4 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-sm text-primary transition-colors"
          >
            Use mock data instead
          </button>
        {/if}
      </div>
    {:else}
      <ul class="divide-y divide-border">
        {#each filteredNews as article (article.id)}
          <li class="group hover:bg-muted/30 transition-colors">
            <div class="p-4 flex items-start justify-between">
              <!-- Checkbox for selection -->
              <div class="flex-shrink-0 mr-3 pt-1">
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(article.id)}
                  onchange={() => toggleSelectItem(article.id)}
                  class="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                />
              </div>
              
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <!-- Source Type Badge -->
                  <span class={`px-2 py-0.5 text-xs rounded-full border ${getSourceTypeColor(article.source_type)}`}>
                    {getSourceLabel(article.source_type)}
                  </span>
                  
                  <!-- Status Badge -->
                  <span class={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(article.status)}`}>
                    {article.status}
                  </span>
                  
                  <!-- Source Name -->
                  {#if article.source_name}
                    <span class="text-sm text-muted-foreground">
                      {article.source_name}
                    </span>
                  {/if}
                  
                  <!-- Publication Date -->
                  {#if article.publication_date}
                    <span class="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock weight="fill" class="h-3 w-3" />
                      {article.publication_date}
                    </span>
                  {/if}
                </div>
                
                <!-- Title -->
                <h3 class="font-medium text-foreground line-clamp-1 mb-1">
                  {article.title || 'Untitled Article'}
                </h3>
                
                <!-- URL -->
                <div class="flex items-center gap-1.5 text-sm text-primary/80 hover:text-primary">
                  <Globe weight="fill" class="h-3.5 w-3.5" />
                  <a href={article.url} target="_blank" rel="noopener noreferrer" class="line-clamp-1 hover:underline">
                    {article.url}
                  </a>
                </div>
                
                <!-- Discovery Date -->
                <div class="mt-2 text-xs text-muted-foreground">
                  Added {formatRelativeTime(article.discovered_at)}
                  {#if article.process_attempts && article.process_attempts > 0}
                    <span class="ml-2">• {article.process_attempts} attempt{article.process_attempts !== 1 ? 's' : ''}</span>
                  {/if}
                </div>
              </div>
              
              <!-- Action buttons -->
              <div class="ml-4 flex-shrink-0">
                {#if article.status === 'pending' || article.status === 'error'}
                  {#if processingItems.includes(article.id)}
                    <button
                      disabled
                      class="p-2 rounded-lg bg-amber-500/10 text-amber-400"
                    >
                      <SpinnerGap weight="bold" class="h-5 w-5 animate-spin" />
                    </button>
                  {:else}
                    <button
                      onclick={() => handleProcess(article)}
                      class="p-2 rounded-lg bg-primary/10 hover:bg-primary/20
                             text-primary hover:text-primary transition-colors group-hover:scale-105 transform duration-200"
                      aria-label="Process this article"
                    >
                      <ArrowRight weight="bold" class="h-5 w-5" />
                    </button>
                  {/if}
                {:else if article.status === 'processing'}
                  <button
                    disabled
                    class="p-2 rounded-lg bg-blue-500/10 text-blue-400"
                  >
                    <SpinnerGap weight="bold" class="h-5 w-5 animate-spin" />
                  </button>
                {:else}
                  <button
                    onclick={() => onSelect(article)}
                    class="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20
                           text-emerald-400 hover:text-emerald-400 transition-colors"
                    aria-label="View processed article"
                  >
                    <ArrowRight weight="bold" class="h-5 w-5" />
                  </button>
                {/if}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  <!-- Pagination or Stats -->
  <div class="p-4 border-t border-border flex justify-between items-center">
    <span class="text-sm text-muted-foreground">
      {filteredNews.length} of {rawNews.length} articles
      {#if useMockData}
        <span class="ml-1 italic">(Mock Data)</span>
      {/if}
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