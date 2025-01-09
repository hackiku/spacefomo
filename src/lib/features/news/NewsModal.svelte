<!-- src/lib/features/news/NewsModal.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { ExternalLink, X } from 'lucide-svelte';
  import { Button } from "$lib/components/ui/button";
  import { fade, fly } from 'svelte/transition';
  import NewsScore from './NewsScore.svelte';
  import type { NewsItem } from '$lib/types';

  export let item: NewsItem;
  
  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close();
    }
  }

  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  function handleUpvote() {
    // TODO: Implement upvote logic
    console.log('Upvoted:', item.id);
  }

  function handleDownvote() {
    // TODO: Implement downvote logic
    console.log('Downvoted:', item.id);
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div 
  class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
  on:click={handleOutsideClick}
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
>
  <div 
    class="bg-zinc-900 w-full max-w-2xl rounded-2xl border-2 border-zinc-800/50 overflow-hidden" 
    in:fly="{{ y: 20, duration: 300 }}" 
    out:fade
  >
    <div class="p-8">
      <!-- Header -->
      <div class="flex justify-between items-start gap-8 mb-8">
        <h2 id="modal-title" class="text-3xl font-medium text-zinc-100 tracking-tight leading-tight">
          {item.title}
        </h2>
        <button 
          on:click={close}
          class="p-2 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/50 transition-colors"
          aria-label="Close dialog"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Summary -->
      {#if item.summary}
        <p class="text-xl text-zinc-300 leading-relaxed mb-8">
          {item.summary}
        </p>
      {/if}
      
      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-8" role="list" aria-label="Article tags">
        {#each item.tags as tag}
          <span role="listitem" class="px-3 py-1.5 text-sm bg-zinc-800/50 text-zinc-400 
                     rounded-full border border-zinc-700/50">
            {tag}
          </span>
        {/each}
      </div>
      
      <!-- Metadata & Actions -->
      <div class="flex items-center justify-between gap-6 pt-6 border-t border-zinc-800/50">
        <div class="flex items-center gap-6">
          <div class="text-sm">
            <div class="text-zinc-400 mb-1">{item.source}</div>
            <div class="text-zinc-500">{item.readTime}</div>
          </div>
          <div class="border-l border-zinc-800/50 pl-6">
            <NewsScore 
              score={item.score}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
            />
          </div>
        </div>
        
        <Button 
          variant="outline"
          class="gap-2 text-base bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600/50"
          on:click={() => window.open(item.url, '_blank')}
          aria-label="Read full article on {item.source}"
        >
          <ExternalLink class="w-4 h-4" aria-hidden="true" />
          Read More
        </Button>
      </div>
    </div>
    
    <!-- Key Points -->
    {#if item.dataPoints}
      <div class="bg-zinc-800/30 p-8 border-t border-zinc-800/50">
        <h3 class="text-lg font-medium text-zinc-300 mb-6">Key Points</h3>
        <dl class="grid grid-cols-2 gap-6">
          {#each item.dataPoints as point}
            <div>
              <dt class="text-sm text-zinc-400 mb-1">{point.label}</dt>
              <dd class="text-lg font-medium text-zinc-200">{point.value}</dd>
            </div>
          {/each}
        </dl>
      </div>
    {/if}
  </div>
</div>