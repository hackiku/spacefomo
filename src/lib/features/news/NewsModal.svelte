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

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div 
  class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8" 
  on:click={handleOutsideClick}
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
>
  <!-- ESC key hint -->
  <div class="absolute top-6 right-6 flex items-center gap-2 text-zinc-600">
    <span class="border border-zinc-700/50 rounded px-2 py-0.5 text-xs font-medium">ESC</span>
    <span class="text-sm">to close</span>
  </div>

  <div 
    class="bg-zinc-900/95 w-full max-w-5xl rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm" 
    in:fly="{{ y: 20, duration: 300 }}" 
    out:fade
  >
    <div class="md:grid md:grid-cols-5 divide-x divide-zinc-800/50">
      <!-- Main Content (3 columns) -->
      <div class="col-span-3 p-8">
        <!-- Header -->
        <div class="flex justify-between items-start gap-8 mb-6">
          <h2 id="modal-title" class="text-3xl font-medium text-zinc-100 tracking-tight leading-tight">
            {item.title}
          </h2>
          <button 
            on:click={close}
            class="p-2.5 text-zinc-400 hover:text-zinc-200 rounded-lg 
                   hover:bg-zinc-800/50 transition-colors"
            aria-label="Close dialog"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Summary -->
        {#if item.summary}
          <p class="text-xl text-zinc-300 leading-relaxed mb-6">
            {item.summary}
          </p>
        {/if}
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-6" role="list" aria-label="Article tags">
          {#each item.tags as tag}
            <span role="listitem" class="px-3 py-1.5 text-sm bg-zinc-800/50 text-zinc-400 
                       rounded-full border border-zinc-700/50">
              {tag}
            </span>
          {/each}
        </div>

        <!-- Source & Score -->
        <div class="flex items-center justify-between border-t border-zinc-800/50 pt-6">
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

          <a 
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 
                   hover:text-zinc-200 transition-colors rounded-lg
                   hover:bg-zinc-800/50 border border-zinc-700/50"
          >
            <ExternalLink class="w-4 h-4" />
            View Source
          </a>
        </div>
      </div>

      <!-- Stats Panel (2 columns) -->
      {#if item.dataPoints}
        <div class="col-span-2 p-8 bg-zinc-900/50">
          <h3 class="text-lg font-medium text-zinc-300 mb-6">Key Points</h3>
          <dl class="space-y-6">
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
</div>