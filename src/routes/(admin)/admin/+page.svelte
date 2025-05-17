<!-- src/routes/(admin)/admin/+page.svelte -->
<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { RocketLaunch, Database, Code, ChartLine } from 'phosphor-svelte';
  import RawNewsQueue from '$lib/components/admin/process/RawNewsQueue.svelte';
  import ProcessArticle from '$lib/components/admin/process/ProcessArticle.svelte';
  import ApiMonitor from '$lib/components/admin/misc/ApiMonitor.svelte';
  import IngestResearch from '$lib/components/admin/ingest/IngestResearch.svelte';
  import { cn } from '$lib/utils';
  
  // Props from +page.server.ts
  let { data } = $props();
  
  // State
  let selectedArticle = $state<any>(null);
  let activeTab = $state('queue');
  
  // Dashboard stats
  let pendingCount = $derived(
    data.rawNewsStats?.filter(stat => stat.status === 'pending')
      .reduce((sum, item) => sum + parseInt(item.count), 0) || 0
  );
  
  let processedToday = $derived(
    data.rawNewsStats?.filter(stat => stat.status === 'processed')
      .reduce((sum, item) => sum + parseInt(item.count), 0) || 0
  );
  
  let costToday = $derived(
    data.apiUsage?.providers.reduce((sum, provider) => sum + provider.costs.today, 0).toFixed(2) || '0.00'
  );
  
  // Effect to update tab when article is selected
  $effect(() => {
    if (selectedArticle) {
      activeTab = 'process';
    }
  });
  
  // Handle article selection
  function selectArticle(article: any) {
    selectedArticle = article;
  }
  
  // Reset process and go back to queue
  function resetProcess() {
    selectedArticle = null;
    activeTab = 'queue';
  }
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
  <header class="mb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <RocketLaunch weight="duotone" class="h-8 w-8 text-primary" />
        <h1 class="text-3xl font-medium text-foreground">Mission Control</h1>
      </div>
      
      <div class="flex items-center gap-3">
        <a 
          href="/" 
          class="px-4 py-2 text-sm rounded-default bg-muted hover:bg-muted/80 
                 text-muted-foreground hover:text-foreground transition-colors"
        >
          Return to Site
        </a>
      </div>
    </div>
    
    <!-- Pipeline Status -->
    <div class="mt-6 px-6 py-3 rounded-default border border-border bg-card/60 backdrop-blur-sm flex items-center justify-between">
      <div class="flex items-center gap-6 text-sm">
        <div class="flex items-center gap-2 text-muted-foreground">
          <span class="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Pipeline Active</span>
        </div>
        
        <div class="text-muted-foreground">
          {pendingCount} articles pending
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <button 
          onclick={() => activeTab = 'queue'}
          class={cn(
            "text-sm transition-colors",
            activeTab === 'queue' 
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Queue
        </button>
        
        <button 
          onclick={() => activeTab = 'ingest'}
          class={cn(
            "text-sm transition-colors",
            activeTab === 'ingest' 
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Ingest
        </button>
        
        <button 
          onclick={() => activeTab = 'api'}
          class={cn(
            "text-sm transition-colors",
            activeTab === 'api' 
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          API Status
        </button>
      </div>
    </div>
  </header>
  
  <main class="grid grid-cols-5 gap-6">
    <!-- Sidebar Navigation -->
    <div class="col-span-1">
      <nav class="rounded-default border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
        <div class="p-4 border-b border-border">
          <h2 class="font-medium text-foreground">Pipeline</h2>
        </div>
        
        <div class="p-3">
          <ul class="space-y-1">
            <li>
              <button
                class={cn(
                  "w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors",
                  activeTab === 'queue' 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onclick={() => activeTab = 'queue'}
              >
                <Database weight={activeTab === 'queue' ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>Raw News Queue</span>
              </button>
            </li>
            <li>
              <button
                class={cn(
                  "w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors",
                  activeTab === 'ingest' 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onclick={() => activeTab = 'ingest'}
              >
                <RocketLaunch weight={activeTab === 'ingest' ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>Ingest Research</span>
              </button>
            </li>
            <li>
              <button
                class={cn(
                  "w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors",
                  activeTab === 'process' 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onclick={() => activeTab = 'process'}
                disabled={!selectedArticle}
              >
                <Code weight={activeTab === 'process' ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>Process Article</span>
              </button>
            </li>
            <li>
              <button
                class={cn(
                  "w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors",
                  activeTab === 'api' 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onclick={() => activeTab = 'api'}
              >
                <ChartLine weight={activeTab === 'api' ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>API Monitor</span>
              </button>
            </li>
          </ul>
        </div>
        
        {#if selectedArticle}
          <div class="p-4 border-t border-border">
            <div class="text-xs text-muted-foreground mb-2">Selected Article</div>
            <div class="text-sm text-foreground line-clamp-1">
              {selectedArticle?.title || selectedArticle?.url.split('/').pop() || 'Untitled Article'}
            </div>
            <div class="text-xs text-muted-foreground mt-1 line-clamp-1">
              {selectedArticle?.source_name || new URL(selectedArticle?.url).hostname}
            </div>
          </div>
        {/if}
      </nav>
      
      <!-- Quick Stats -->
      <div class="mt-6 rounded-default border border-border bg-card/60 backdrop-blur-sm p-4 space-y-4">
        <h3 class="text-sm font-medium text-foreground">Today's Activity</h3>
        
        <div class="grid grid-cols-1 gap-3">
          <div class="border border-border rounded-lg p-3 bg-card/40">
            <div class="text-xs text-muted-foreground">Processed Articles</div>
            <div class="text-2xl font-medium text-foreground mt-1">{processedToday}</div>
          </div>
          
          <div class="border border-border rounded-lg p-3 bg-card/40">
            <div class="text-xs text-muted-foreground">API Cost</div>
            <div class="text-2xl font-medium text-foreground mt-1">${costToday}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="col-span-4">
      {#if activeTab === 'queue'}
        <RawNewsQueue onSelect={selectArticle} />
      {:else if activeTab === 'process' && selectedArticle}
        <ProcessArticle article={selectedArticle} onComplete={resetProcess} />
      {:else if activeTab === 'ingest'}
        <IngestResearch />
      {:else if activeTab === 'api'}
        <ApiMonitor />
      {/if}
    </div>
  </main>
</div>