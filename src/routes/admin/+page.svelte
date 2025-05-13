<!-- src/routes/admin/+page.svelte -->

<script lang="ts">
  import { ArrowRight, RocketLaunch, Database, Code } from 'phosphor-svelte';
  import RawNewsQueue from './process/RawNewsQueue.svelte';
  import ProcessArticle from './process/ProcessArticle.svelte';
  import ApiMonitor from './misc/ApiMonitor.svelte';
  
  // State
  let selectedArticle = $state<any>(null);
  let activeTab = $state('queue');
  
  // Effect for URL params
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
          5 articles pending
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <button 
          onclick={() => activeTab = 'api'}
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                class={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2
                       ${activeTab === 'queue' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'} 
                       transition-colors`}
                onclick={() => activeTab = 'queue'}
              >
                <Database weight={activeTab === 'queue' ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>Raw News Queue</span>
              </button>
            </li>
            <li>
              <button
                class={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2
                       ${activeTab === 'process' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                       transition-colors`}
                onclick={() => activeTab = 'process'}
                disabled={!selectedArticle}
              >
                <Code weight={activeTab === 'process' ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>Process Article</span>
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
            <div class="text-2xl font-medium text-foreground mt-1">12</div>
          </div>
          
          <div class="border border-border rounded-lg p-3 bg-card/40">
            <div class="text-xs text-muted-foreground">API Cost</div>
            <div class="text-2xl font-medium text-foreground mt-1">$2.43</div>
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
      {:else if activeTab === 'api'}
        <ApiMonitor />
      {/if}
    </div>
  </main>
</div>