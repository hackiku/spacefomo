<!-- src/lib/components/admin/ingest/IngestResearch.svelte -->
<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { MagnifyingGlass, SpinnerGap, Check } from 'phosphor-svelte';
  import type { ResearchRequest } from '../types';
  
  // State
  let inputType = $state<'url' | 'topic'>('url');
  let url = $state('');
  let topic = $state('');
  let timeframe = $state('recent');
  let provider = $state('perplexity');
  let isSubmitting = $state(false);
  let success = $state(false);
  let error = $state<string | null>(null);
  
  // Handle form submission
  async function handleSubmit() {
    isSubmitting = true;
    success = false;
    error = null;
    
    try {
      const request: ResearchRequest = {
        type: inputType,
        provider
      };
      
      // Add the appropriate fields based on the type
      if (inputType === 'url') {
        request.url = url;
      } else if (inputType === 'topic') {
        request.topic = topic;
        request.timeframe = timeframe;
      }
      
      // Call the TRPC mutation
      const result = await trpc().admin.startAgentResearch.mutate(request);
      
      if (result.success) {
        success = true;
        // Reset form fields
        if (inputType === 'url') url = '';
        if (inputType === 'topic') topic = '';
      } else {
        error = result.error || 'Unknown error occurred';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error occurred';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="rounded-default border border-border bg-card/60 backdrop-blur-sm">
  <div class="p-5 border-b border-border">
    <h2 class="text-lg font-medium text-foreground">Research Ingest</h2>
    <p class="text-sm text-muted-foreground mt-1">
      Add new content to the processing queue from various sources
    </p>
  </div>
  
  <div class="p-5">
    <!-- Input type selector -->
    <div class="flex rounded-lg border border-border overflow-hidden mb-6">
      <button
        onclick={() => inputType = 'url'}
        class={`flex-1 py-2 text-sm transition-colors ${inputType === 'url' 
          ? "bg-primary/10 text-primary border-b-2 border-primary" 
          : "text-muted-foreground hover:text-foreground"}`}
      >
        URL Research
      </button>
      <button
        onclick={() => inputType = 'topic'}
        class={`flex-1 py-2 text-sm transition-colors ${inputType === 'topic' 
          ? "bg-primary/10 text-primary border-b-2 border-primary" 
          : "text-muted-foreground hover:text-foreground"}`}
      >
        Topic Research
      </button>
    </div>
    
    <form onsubmit={handleSubmit} class="space-y-4">
      <!-- URL input -->
      {#if inputType === 'url'}
        <div class="space-y-2">
          <label for="url" class="block text-sm font-medium text-foreground">
            URL to Research
          </label>
          <input
            id="url"
            type="url"
            bind:value={url}
            placeholder="https://example.com/article"
            required
            class="w-full px-4 py-2 rounded-lg bg-muted border border-border
                   text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      {:else if inputType === 'topic'}
        <div class="space-y-2">
          <label for="topic" class="block text-sm font-medium text-foreground">
            Topic to Research
          </label>
          <input
            id="topic"
            type="text"
            bind:value={topic}
            placeholder="e.g. SpaceX Starship Updates"
            required
            class="w-full px-4 py-2 rounded-lg bg-muted border border-border
                   text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        
        <div class="space-y-2">
          <label for="timeframe" class="block text-sm font-medium text-foreground">
            Timeframe
          </label>
          <select
            id="timeframe"
            bind:value={timeframe}
            class="w-full px-4 py-2 rounded-lg bg-muted border border-border
                   text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="recent">Recent (Last 7 days)</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      {/if}
      
      <!-- Provider selection -->
      <div class="space-y-2">
        <label for="provider" class="block text-sm font-medium text-foreground">
          Research Provider
        </label>
        <select
          id="provider"
          bind:value={provider}
          class="w-full px-4 py-2 rounded-lg bg-muted border border-border
                 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="perplexity">Perplexity</option>
          <option value="anthropic">Claude</option>
          <option value="openai">GPT-4o</option>
        </select>
      </div>
      
      <!-- Submission button -->
      <div class="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          class={`w-full px-4 py-3 rounded-lg text-white flex items-center justify-center gap-2
                 ${isSubmitting 
                    ? "bg-primary/60 cursor-not-allowed" 
                    : "bg-primary hover:bg-primary/90 transition-colors"}`}
        >
          {#if isSubmitting}
            <SpinnerGap weight="bold" class="h-5 w-5 animate-spin" />
            <span>Submitting...</span>
          {:else}
            <MagnifyingGlass weight="bold" class="h-5 w-5" />
            <span>Start Research</span>
          {/if}
        </button>
      </div>
    </form>
    
    <!-- Success/error messages -->
    {#if success}
      <div class="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
        <Check weight="bold" class="h-5 w-5 text-emerald-400" />
        <p class="text-emerald-400">Research submitted successfully! Check the queue for updates.</p>
      </div>
    {:else if error}
      <div class="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p class="text-red-400">Error: {error}</p>
      </div>
    {/if}
  </div>
</div>