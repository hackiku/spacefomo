<!-- src/lib/features/news/NewsModal.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { ExternalLink, X } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import NewsScore from './NewsScore.svelte';
  import type { NewsItem } from '$lib/types';

  export let item: NewsItem;
  const dispatch = createEventDispatcher();
  
  // Format the date if it exists
  $: formattedDate = item.date 
    ? new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  function close() {
    dispatch('close');
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
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

<!-- Modal structure remains mostly the same -->
<div role="dialog" aria-labelledby="modal-title" aria-modal="true" class="fixed inset-0 z-[100]">
  <!-- ... backdrop and ESC key hint remain the same ... -->

  <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl
               bg-zinc-900/95 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm" 
    in:fly={{ y: 20, duration: 300 }} 
    out:fade
  >
    <div class="md:grid md:grid-cols-5 divide-x divide-zinc-800/50">
      <!-- Main Content -->
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
        {#if item.tags && item.tags.length > 0}
          <div class="flex flex-wrap gap-2 mb-6">
            {#each item.tags as tag}
              <span class="px-3 py-1.5 text-sm bg-zinc-800/50 text-zinc-400 
                          rounded-full border border-zinc-700/50">
                {tag}
              </span>
            {/each}
          </div>
        {/if}

        <!-- Source & Score -->
        <div class="flex items-center justify-between border-t border-zinc-800/50 pt-6">
          <div class="flex items-center gap-6">
            {#if item.source || item.readTime || formattedDate}
              <div class="text-sm">
                {#if item.source}
                  <div class="text-zinc-400 mb-1">{item.source}</div>
                {/if}
                {#if item.readTime}
                  <div class="text-zinc-500">{item.readTime} min read</div>
                {/if}
                {#if formattedDate}
                  <div class="text-zinc-500">{formattedDate}</div>
                {/if}
              </div>
            {/if}
            {#if typeof item.score !== 'undefined'}
              <div class="border-l border-zinc-800/50 pl-6">
                <NewsScore score={item.score} />
              </div>
            {/if}
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
            Read Source
          </a>
        </div>
      </div>

      <!-- Stats Panel -->
      {#if item.dataPoints && item.dataPoints.length > 0}
        <div class="col-span-2 p-8 bg-zinc-900/50">
          <h3 class="text-lg font-medium text-zinc-300 mb-6">Key Points</h3>
          <dl class="space-y-6">
            {#each item.dataPoints as point}
              {#if point.label && point.value}
                <div>
                  <dt class="text-sm text-zinc-400 mb-1">{point.label}</dt>
                  <dd class="text-lg font-medium text-zinc-200">{point.value}</dd>
                </div>
              {/if}
            {/each}
          </dl>
        </div>
      {/if}
    </div>
  </div>
</div>