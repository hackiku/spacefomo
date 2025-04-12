<!-- src/lib/features/news/card/Source.svelte -->
<script lang="ts">
  import { ArrowUpRight, Check } from 'phosphor-svelte';
  
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

<div class="rounded-full border border-zinc-700/30 bg-zinc-800/20 backdrop-blur-sm">
  <!-- Top metadata row -->
  <div class="flex items-center justify-between px-5 py-3">
    <!-- Source and metadata -->
    <div class="flex flex-wrap items-center gap-x-3 text-sm text-zinc-400">
      {#if source}
        <span class="font-medium text-zinc-300">{source}</span>
        {#if readTime || publicationDate}
          <span class="text-zinc-600">•</span>
        {/if}
      {/if}
      
      {#if readTime}
        <span>{readTime} min read</span>
        {#if publicationDate}
          <span class="text-zinc-600">•</span>
        {/if}
      {/if}
      
      {#if publicationDate}
        <span>{formatDate(publicationDate)}</span>
      {/if}
    </div>
    
    <!-- Original article button -->
    {#if url}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-8 items-center gap-1.5 rounded-full bg-zinc-800/80 px-3 text-sm text-zinc-300 transition-all
               hover:bg-zinc-700 hover:text-zinc-100"
      >
        <span>Original</span>
        <ArrowUpRight class="h-3.5 w-3.5" />
      </a>
    {/if}
  </div>
  
  <!-- Title -->
  <div class="border-t border-zinc-800/50 px-5 py-3">
    <p class="text-lg font-medium leading-relaxed text-zinc-200">
      {originalTitle}
    </p>
  </div>
  
  <!-- URL row (clickable to copy) -->
  {#if url}
    <button
      onclick={copyUrl}
      class="flex w-full items-center border-t border-zinc-800/50 px-5 py-2.5 text-left text-xs text-zinc-500 
             transition-all hover:bg-zinc-800/30"
    >
      <div class="relative flex-1 overflow-hidden pr-6">
        <span>{shortenUrl(url)}</span>
        <!-- Gradient fade -->
        <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-zinc-800/20"></div>
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