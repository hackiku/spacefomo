<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
  import { ArrowCircleRight, Article, Gear, Alien, Warning } from 'phosphor-svelte';
  import ArticleQueue from './ArticleQueue.svelte';
  import ProcessStages from './ProcessStages.svelte';
  import ArticlePreview from './ArticlePreview.svelte';
  import PromptLibrary from './PromptLibrary.svelte';
  import ApiStatus from './ApiStatus.svelte';

  // State
  let selectedArticle = $state<any>(null);
  let processingStage = $state<string | null>(null);
  let showPromptLibrary = $state(false);
  let showApiStatus = $state(false);
  
  // Tab management
  let activeTab = $state('queue');
  
  function selectArticle(article: any) {
    selectedArticle = article;
    activeTab = 'process';
  }

  function resetProcess() {
    processingStage = null;
  }
</script>

<div class="container mx-auto px-4 py-18 max-w-7xl">
  <header class="mb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Alien weight="duotone" class="h-8 w-8 text-violet-400" />
        <h1 class="text-2xl font-bold text-zinc-100">Spacefomo Admin</h1>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          class="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          onclick={() => showApiStatus = !showApiStatus}
        >
          <Gear weight="duotone" class="h-5 w-5" />
        </button>
        
        <a 
          href="/" 
          class="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 
                 rounded-lg transition-colors"
        >
          Exit to Site
        </a>
      </div>
    </div>
    
    <!-- Status Messages -->
    <div class="mt-4 px-4 py-2 bg-zinc-800/50 rounded-xl border border-zinc-700/50 flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm text-zinc-400">
        <span class="flex h-2 w-2 rounded-full bg-emerald-500"></span>
        <span>AI Systems Operational</span>
      </div>
      
      <div class="text-sm text-zinc-500">
        5 articles in queue
      </div>
    </div>
  </header>
  
  <main class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Sidebar Navigation -->
    <div class="lg:col-span-1">
      <nav class="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
        <div class="p-4 border-b border-zinc-800">
          <h2 class="font-medium text-zinc-200">Navigation</h2>
        </div>
        
        <div class="p-3">
          <ul class="space-y-1">
            <li>
              <button
                class="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2
                       {activeTab === 'queue' ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'} 
                       transition-colors"
                onclick={() => activeTab = 'queue'}
              >
                <Article weight={activeTab === 'queue' ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>Article Queue</span>
              </button>
            </li>
            <li>
              <button
                class="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2
                       {activeTab === 'process' ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}
                       transition-colors"
                onclick={() => activeTab = 'process'}
                disabled={!selectedArticle}
              >
                <ArrowCircleRight weight={activeTab === 'process' ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>Process Article</span>
              </button>
            </li>
            <li>
              <button
                class="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2
                       {showPromptLibrary ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}
                       transition-colors"
                onclick={() => showPromptLibrary = !showPromptLibrary}
              >
                <Gear weight={showPromptLibrary ? 'fill' : 'regular'} class="h-5 w-5" />
                <span>Prompt Library</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      
      {#if selectedArticle && activeTab === 'process'}
        <!-- Article Preview Card when processing -->
        <div class="mt-4">
          <ArticlePreview article={selectedArticle} />
        </div>
      {/if}
      
      {#if showApiStatus}
        <!-- API Status Panel -->
        <div class="mt-4">
          <ApiStatus />
        </div>
      {/if}
    </div>
    
    <!-- Main Content Area -->
    <div class="lg:col-span-2">
      {#if activeTab === 'queue'}
        <ArticleQueue onSelect={selectArticle} />
      {:else if activeTab === 'process' && selectedArticle}
        <ProcessStages article={selectedArticle} onReset={resetProcess} />
      {/if}
      
      {#if showPromptLibrary}
        <div class="mt-6">
          <PromptLibrary />
        </div>
      {/if}
    </div>
  </main>
</div>