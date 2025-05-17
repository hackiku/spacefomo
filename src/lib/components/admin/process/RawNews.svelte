<!-- src/lib/components/admin/process/RawNews.svelte -->

<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { ArrowRight, Globe, Clock, SpinnerGap } from 'phosphor-svelte';
  import { cn } from '$lib/utils';
  import type { RawNewsItem } from '../types';
  
  // Props
  let { item, onSelect, onProcess, isProcessing = false } = $props<{
    item: RawNewsItem;
    onSelect: (article: RawNewsItem) => void;
    onProcess: (id: string, provider: string) => void;
    isProcessing?: boolean;
  }>();
  
  // Provider selection
  let selectedProvider = $state('perplexity');
  
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
  
  // Format source type display
  function getSourceLabel(type: string) {
    switch(type) {
      case 'agent_research': return 'AI Research';
      case 'submission': return 'User Submission';
      default: return type;
    }
  }
  
  // Badge styling helper
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
  
  // Status styling helper
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

<li class="group hover:bg-muted/30 transition-colors">
  <div class="p-4 flex items-start justify-between">
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2 mb-2">
        <!-- Source Type Badge -->
        <span class={`px-2 py-0.5 text-xs rounded-full border ${getSourceTypeColor(item.source_type)}`}>
          {getSourceLabel(item.source_type)}
        </span>
        
        <!-- Status Badge -->
        <span class={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
        
        <!-- Source Name -->
        {#if item.source_name}
          <span class="text-sm text-muted-foreground">
            {item.source_name}
          </span>
        {/if}
        
        <!-- Publication Date -->
        {#if item.publication_date}
          <span class="text-sm text-muted-foreground flex items-center gap-1">
            <Clock weight="fill" class="h-3 w-3" />
            {item.publication_date}
          </span>
        {/if}
      </div>
      
      <!-- Title -->
      <h3 class="font-medium text-foreground line-clamp-1 mb-1">
        {item.title || 'Untitled Article'}
      </h3>
      
      <!-- URL -->
      <div class="flex items-center gap-1.5 text-sm text-primary/80 hover:text-primary">
        <Globe weight="fill" class="h-3.5 w-3.5" />
        <a href={item.url} target="_blank" rel="noopener noreferrer" class="line-clamp-1 hover:underline">
          {item.url}
        </a>
      </div>
      
      <!-- Discovery Date -->
      <div class="mt-2 text-xs text-muted-foreground">
        Added {formatRelativeTime(item.discovered_at)}
        {#if item.process_attempts && item.process_attempts > 0}
          <span class="ml-2">• {item.process_attempts} attempt{item.process_attempts !== 1 ? 's' : ''}</span>
        {/if}
      </div>
    </div>
    
    <!-- Action buttons -->
    <div class="ml-4 flex-shrink-0">
      {#if item.status === 'pending' || item.status === 'error'}
        {#if isProcessing}
          <button
            disabled
            class="p-2 rounded-lg bg-amber-500/10 text-amber-400"
          >
            <SpinnerGap weight="bold" class="h-5 w-5 animate-spin" />
          </button>
        {:else}
          <button
            onclick={() => onProcess(item.id, selectedProvider)}
            class="p-2 rounded-lg bg-primary/10 hover:bg-primary/20
                   text-primary hover:text-primary transition-colors group-hover:scale-105 transform duration-200"
            aria-label="Process this article"
          >
            <ArrowRight weight="bold" class="h-5 w-5" />
          </button>
        {/if}
      {:else if item.status === 'processing'}
        <button
          disabled
          class="p-2 rounded-lg bg-blue-500/10 text-blue-400"
        >
          <SpinnerGap weight="bold" class="h-5 w-5 animate-spin" />
        </button>
      {:else}
        <button
          onclick={() => onSelect(item)}
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