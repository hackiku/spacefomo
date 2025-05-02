<!-- src/lib/features/news/article/source/Source.svelte -->
<script lang="ts">
  import { ArrowUpRight, Copy, Check, Clock } from 'phosphor-svelte';
  
  let { originalTitle, source, readTime, publicationDate, url } = $props<{
    originalTitle: string;
    source: string | null;
    readTime: number | null;
    publicationDate: Date | null;
    url?: string;
  }>();

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // URL shortening function
  function shortenUrl(fullUrl: string | undefined): string {
    if (!fullUrl) return '';
    try {
      const url = new URL(fullUrl);
      return url.hostname + url.pathname.substring(0, 15) + (url.pathname.length > 15 ? '...' : '');
    } catch {
      return fullUrl.substring(0, 30) + (fullUrl.length > 30 ? '...' : '');
    }
  }
  
  let copied = $state(false);
  
  function copyUrl() {
    if (url) {
      navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    }
  }
</script>

<div class="rounded-xl bg-zinc-800/20 border border-zinc-700/30 overflow-hidden">
  <!-- Top metadata row -->
  <div class="px-5 py-4">
    <div class="flex flex-wrap gap-4 items-center mb-4">
      <!-- Source badge -->
      {#if source}
        <div class="px-3 py-1.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-700/40 text-sm font-medium">
          {source}
        </div>
      {/if}
      
      <!-- Date and read time -->
      <div class="flex items-center gap-4">
        {#if publicationDate}
          <div class="flex items-center gap-1.5 text-sm text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" class="text-zinc-500">
              <path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16Zm0 176H48V48h24v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v160Z"/>
              <path fill="currentColor" d="M128 112a8 8 0 0 1 8 8v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 8-8Zm-32 32a8 8 0 0 0-8 8v32a8 8 0 0 0 16 0v-32a8 8 0 0 0-8-8Zm64-16a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-48a8 8 0 0 0-8-8Z"/>
            </svg>
            <span>{formatDate(publicationDate)}</span>
          </div>
        {/if}
        
        {#if readTime}
          <div class="flex items-center gap-1.5 text-sm text-zinc-400">
            <Clock class="h-4 w-4 text-zinc-500" />
            <span>{readTime} min read</span>
          </div>
        {/if}
      </div>
      
      <!-- Original article button -->
      {#if url}
        <div class="ml-auto">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-full bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300 transition-all
                 hover:bg-zinc-700 hover:text-zinc-100"
          >
            <span>Original</span>
            <ArrowUpRight class="h-3.5 w-3.5" />
          </a>
        </div>
      {/if}
    </div>
    
    <!-- Title -->
    <p class="text-lg font-medium leading-relaxed text-zinc-200">
      {originalTitle}
    </p>
  </div>
  
  <!-- URL row (clickable to copy) -->
  {#if url}
    <button
      on:click={copyUrl}
      class="flex w-full items-center border-t border-zinc-700/30 px-5 py-3 text-left text-xs text-zinc-500 
           transition-all hover:bg-zinc-800/50"
    >
      <div class="relative flex-1 overflow-hidden pr-6">
        <span>{shortenUrl(url)}</span>
        <!-- Gradient fade -->
        <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-zinc-800/50"></div>
      </div>
      
      <div class="flex-shrink-0 pl-2">
        {#if copied}
          <div class="flex items-center gap-1 text-emerald-400">
            <Check class="h-3 w-3" />
            <span>Copied</span>
          </div>
        {:else}
          <span class="text-zinc-600">Click to copy</span>
        {/if}
      </div>
    </button>
  {/if}
</div>