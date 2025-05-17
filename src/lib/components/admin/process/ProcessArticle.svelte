<!-- src/lib/components/admin/process/ProcessArticle.svelte -->
<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { ArrowClockwise, CheckCircle, CopySimple, Gear, Lightning, MagicWand, Robot, SpinnerGap, Globe, Clock } from 'phosphor-svelte';
  import { cn } from '$lib/utils';
  import type { RawNewsItem } from '../types';
  
  // Props
  let { article, onComplete } = $props<{
    article: RawNewsItem;
    onComplete: () => void;
  }>();
  
  // Define the processing stages
  const stages = [
    { 
      id: 'extract_content', 
      title: 'Extract Content', 
      description: 'Extract structured content from the article',
      icon: MagicWand,
      provider: 'perplexity'
    },
    { 
      id: 'process_article', 
      title: 'Process Article', 
      description: 'Generate metadata, summaries, and tags',
      icon: Robot,
      provider: 'anthropic'
    }
  ];
  
  // Track stage statuses
  let stageStatus = $state({
    extract_content: { status: 'idle', data: null },
    process_article: { status: 'idle', data: null }
  });
  
  // Current stage
  let currentStage = $state('extract_content');
  let selectedProvider = $state(stages.find(s => s.id === currentStage)?.provider || 'perplexity');
  
  // Process a stage with TRPC
  async function processStage(stage: string) {
    // Update status to loading
    stageStatus[stage].status = 'loading';
    
    try {
      // Call the appropriate TRPC procedure based on the stage
      if (stage === 'extract_content') {
        // Extract content with the selected provider
        const result = await trpc().admin.extractContent.mutate({
          id: article.id,
          provider: selectedProvider
        });
        
        if (result.success) {
          stageStatus[stage].data = result.data;
          stageStatus[stage].status = 'success';
          
          // Auto advance to next stage
          currentStage = 'process_article';
          selectedProvider = stages.find(s => s.id === 'process_article')?.provider || 'anthropic';
        } else {
          stageStatus[stage].status = 'error';
          stageStatus[stage].data = { error: result.error };
        }
      } else if (stage === 'process_article') {
        // Process the article with the selected provider
        const result = await trpc().admin.processNewsContent.mutate({
          id: article.id,
          provider: selectedProvider,
          content: stageStatus.extract_content.data
        });
        
        if (result.success) {
          stageStatus[stage].data = result.data;
          stageStatus[stage].status = 'success';
        } else {
          stageStatus[stage].status = 'error';
          stageStatus[stage].data = { error: result.error };
        }
      }
    } catch (error) {
      console.error(`Error processing ${stage}:`, error);
      stageStatus[stage].status = 'error';
      stageStatus[stage].data = { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
  
  // Save the processed article to the database
  async function saveArticle() {
    try {
      // This would call your TRPC save mutation
      const result = await trpc().admin.saveProcessedNews.mutate({
        rawNewsId: article.id,
        processedData: {
          ...stageStatus.extract_content.data,
          ...stageStatus.process_article.data
        }
      });
      
      if (result.success) {
        // Return to the queue
        onComplete();
      } else {
        console.error('Error saving article:', result.error);
        // Add error handling UI as needed
      }
    } catch (error) {
      console.error('Error saving article:', error);
      // Add error handling UI as needed
    }
  }
  
  // Rest of your helper functions
  // formatRelativeTime, getStatusColor, etc...
  
  // Check if all stages are complete
  let isComplete = $derived(
    stageStatus.extract_content.status === 'success' && 
    stageStatus.process_article.status === 'success'
  );
  
  // Rest of your component...
</script>

<!-- Your existing template from ProcessArticle.svelte -->

<div class="rounded-default border border-border bg-card/60 backdrop-blur-sm">
  <!-- Header with article info -->
  <div class="p-5 border-b border-border flex items-center justify-between">
    <div>
      <h2 class="text-lg font-medium text-foreground">Process Article</h2>
      <p class="text-sm text-muted-foreground mt-1">
        Transform raw news into processed content
      </p>
    </div>
    
    <!-- Article quick info -->
    <div class="flex items-center gap-3">
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        class="px-3 py-1.5 rounded-lg bg-muted text-sm flex items-center gap-1.5
               text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe weight="bold" class="h-4 w-4" />
        <span>View Source</span>
      </a>
    </div>
  </div>
  
  <!-- Article Summary -->
  <div class="p-4 border-b border-border bg-muted/30">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Article</div>
        <h3 class="text-foreground font-medium">
          {article.title || 'Untitled Article'}
        </h3>
        <div class="text-sm text-muted-foreground mt-1">{article.source_name}</div>
      </div>
      
      <div class="flex flex-col md:items-end justify-center">
        <div class="flex items-center gap-3 text-sm text-muted-foreground">
          <div class="flex items-center gap-1">
            <Clock weight="fill" class="h-4 w-4" />
            <span>Added {formatRelativeTime(article.discovered_at)}</span>
          </div>
          
          <span>•</span>
          
          <div class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
            {article.source_type === 'agent_research' ? 'AI Research' : 'User Submission'}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Processing Stages -->
  <div class="p-5">
    <div class="flex items-center gap-3 mb-6">
      {#each stages as stage, i}
        <button 
          onclick={() => {
            // Only allow navigation to stages that are complete or the current stage
            if (stageStatus[stage.id].status === 'success' || stage.id === currentStage) {
              currentStage = stage.id;
              selectedProvider = stages.find(s => s.id === stage.id)?.provider || 'perplexity';
            }
          }}
          class={`flex-1 relative rounded-lg border p-3 transition-all
                  ${currentStage === stage.id 
                    ? 'border-primary/50 bg-primary/5' 
                    : stageStatus[stage.id].status === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-border bg-card/40'}`}
        >
          <!-- Status indicator -->
          <div class="absolute top-2 right-2">
            {#if stageStatus[stage.id].status === 'loading'}
              <SpinnerGap weight="bold" class="h-4 w-4 text-amber-400 animate-spin" />
            {:else if stageStatus[stage.id].status === 'success'}
              <CheckCircle weight="fill" class="h-4 w-4 text-emerald-400" />
            {:else if stageStatus[stage.id].status === 'error'}
              <div class="h-4 w-4 text-red-400">!</div>
            {/if}
          </div>
          
          <div class="flex items-center gap-2 mb-2">
            <div class={`h-8 w-8 rounded-full flex items-center justify-center
                      ${currentStage === stage.id 
                        ? 'bg-primary/20 text-primary' 
                        : stageStatus[stage.id].status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-muted text-muted-foreground'}`}
            >
              <svelte:component this={stage.icon} weight="bold" class="h-5 w-5" />
            </div>
            <span class={`font-medium ${currentStage === stage.id 
                            ? 'text-primary' 
                            : stageStatus[stage.id].status === 'success'
                              ? 'text-emerald-400'
                              : 'text-foreground'}`}
            >
              {stage.title}
            </span>
          </div>
          
          <p class="text-xs text-muted-foreground">
            {stage.description}
          </p>
        </button>
        
        {#if i < stages.length - 1}
          <div class="h-px w-10 bg-border self-start mt-8"></div>
        {/if}
      {/each}
    </div>
    
    <!-- Current Stage Content -->
    {#each stages as stage}
      {#if currentStage === stage.id}
        <div class="mt-8">
          <!-- Stage controls -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-foreground">{stage.title}</h3>
            
            <div class="flex items-center gap-3">
              <!-- Provider selector -->
              <div class="relative">
                <select 
                  bind:value={selectedProvider}
                  disabled={stageStatus[stage.id].status === 'loading' || stageStatus[stage.id].status === 'success'}
                  class="appearance-none pl-9 pr-8 py-1.5 rounded-lg bg-muted border border-border 
                         text-sm text-muted-foreground focus:text-foreground
                         disabled:opacity-60 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {#each getProviderOptions(stage.id) as provider}
                    <option value={provider}>{formatProviderName(provider)}</option>
                  {/each}
                </select>
                <div class="absolute left-2 top-1.5 pointer-events-none text-muted-foreground">
                  <Robot weight="duotone" class="h-5 w-5" />
                </div>
              </div>
              
              <!-- Process button -->
              {#if stageStatus[stage.id].status === 'idle'}
                <button
                  onclick={() => processStage(stage.id)}
                  class="px-4 py-1.5 rounded-lg bg-primary text-white
                         hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Lightning weight="bold" class="h-5 w-5" />
                  <span>Process with {formatProviderName(selectedProvider)}</span>
                </button>
              {:else if stageStatus[stage.id].status === 'loading'}
                <button
                  disabled
                  class="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-400
                         flex items-center gap-2 cursor-not-allowed"
                >
                  <SpinnerGap weight="bold" class="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </button>
              {:else if stageStatus[stage.id].status === 'success'}
                <button
                  onclick={() => {
                    // Reset this stage
                    stageStatus[stage.id].status = 'idle';
                    stageStatus[stage.id].data = null;
                  }}
                  class="px-4 py-1.5 rounded-lg border border-border text-muted-foreground
                         hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                >
                  <ArrowClockwise weight="bold" class="h-5 w-5" />
                  <span>Try Again</span>
                </button>
              {/if}
            </div>
          </div>
          
          <!-- Content area -->
          {#if stageStatus[stage.id].status === 'idle'}
            <div class="p-8 border border-dashed border-border rounded-lg text-center">
              <svelte:component this={stage.icon} weight="duotone" class="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p class="text-muted-foreground">Ready to process this article.</p>
              <p class="text-sm text-muted-foreground/80 mt-1">
                Click the "Process" button to start.
              </p>
            </div>
          {:else if stageStatus[stage.id].status === 'loading'}
            <div class="p-8 border border-dashed border-amber-500/30 rounded-lg bg-amber-500/5 text-center">
              <SpinnerGap weight="bold" class="h-12 w-12 text-amber-400 animate-spin mx-auto mb-3" />
              <p class="text-amber-400">Processing with {formatProviderName(selectedProvider)}</p>
              <p class="text-sm text-amber-400/80 mt-1">
                This may take a few seconds...
              </p>
            </div>
          {:else if stageStatus[stage.id].status === 'success'}
            <div class="border border-emerald-500/30 rounded-lg overflow-hidden">
              <!-- Result header -->
              <div class="p-3 bg-emerald-500/10 border-b border-emerald-500/30 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <CheckCircle weight="fill" class="h-5 w-5 text-emerald-400" />
                  <span class="font-medium text-emerald-400">Processing Complete</span>
                </div>
                
                <div class="flex gap-2">
                  <button
                    onclick={() => {
                      // Copy to clipboard functionality would go here
                      alert('Copied to clipboard');
                    }}
                    class="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 
                           text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Copy to clipboard"
                  >
                    <CopySimple weight="bold" class="h-4 w-4" />
                  </button>
                  
                  <button
                    onclick={() => {
                      // Edit functionality would go here
                      alert('Edit functionality would go here');
                    }}
                    class="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 
                           text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Edit result"
                  >
                    <Gear weight="bold" class="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <!-- Result content -->
              <div class="p-4 max-h-96 overflow-auto font-mono text-sm bg-black/10">
                <pre class="text-foreground whitespace-pre-wrap">
{JSON.stringify(stageStatus[stage.id].data, null, 2)}
                </pre>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
  
  <!-- Footer actions -->
  <div class="p-4 border-t border-border flex items-center justify-between">
    <button
      onclick={() => onComplete()}
      class="px-3 py-1.5 rounded-lg border border-border text-sm
             text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
    >
      Back to Queue
    </button>
    
    {#if isComplete}
      <button
        class="px-4 py-1.5 rounded-lg bg-emerald-500 text-white
               hover:bg-emerald-600 transition-colors flex items-center gap-2"
        onclick={() => {
          // In a real implementation, this would save to the database
          // For now, just complete the process
          onComplete();
        }}
      >
        <CheckCircle weight="fill" class="h-5 w-5" />
        <span>Save to Database</span>
      </button>
    {/if}
  </div>
</div>