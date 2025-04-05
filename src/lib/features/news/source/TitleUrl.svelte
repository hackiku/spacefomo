<!-- src/lib/features/news/source/TitleUrl.svelte -->
<script lang="ts">
  import { ArrowUpRight, Calendar, Clock } from 'phosphor-svelte';
  
  let { title, url, publicationDate, readTime, copied = false, onCopyUrl } = $props<{
    title: string;
    url: string;
    publicationDate: Date | null;
    readTime: number | null;
    copied?: boolean;
    onCopyUrl: () => void;
  }>();

  // Format date in a more readable way
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Shorten URL for display
  function shortenUrl(fullUrl: string): string {
    try {
      const url = new URL(fullUrl);
      return url.hostname + url.pathname.substring(0, 20) + (url.pathname.length > 20 ? '...' : '');
    } catch {
      return fullUrl.substring(0, 30) + (fullUrl.length > 30 ? '...' : '');
    }
  }
</script>

<div class="rounded-xl border border-zinc-700/30 bg-zinc-800/20 backdrop-blur-sm overflow-hidden">
  <div class="flex items-start">
    <!-- Date and Read Time Column -->
    <div class="flex-shrink-0 border-r border-zinc-700/30 p-4 bg-black/10 w-32">
      {#if publicationDate}
        <div class="flex flex-col items-center">
          <div class="text-sm text-zinc-500 mb-1 flex items-center gap-1">
            <Calendar class="h-3.5 w-3.5" />
            <span>Published</span>
          </div>
          <div class="text-center text-zinc-300 font-medium">
            {formatDate(publicationDate)}
          </div>
          
          {#if readTime}
            <div class="mt-3 flex items-center gap-1 text-xs text-zinc-500">
              <Clock class="h-3.5 w-3.5" />
              <span>{readTime} min read</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
    
    <!-- Title and URL Column -->
    <div class="flex-1 p-4">
      <!-- Title -->
      <h2 class="text-lg font-medium text-zinc-200 mb-2">
        {title}
      </h2>
      
      <!-- URL (clickable to copy) -->
      <button
        class="w-full text-left flex items-center"
        onclick={onCopyUrl}
      >
        <div class="relative flex-1 overflow-hidden pr-6">
          <span class="text-xs text-zinc-500">{shortenUrl(url)}</span>
          <!-- Gradient fade -->
          <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-zinc-800/20"></div>
        </div>
        
        {#if copied}
          <span class="text-xs text-emerald-400 pl-1">Copied</span>
        {/if}
      </button>
    </div>
    
    <!-- Original Article Button -->
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center justify-center flex-shrink-0 h-full w-12 bg-black/10 border-l border-zinc-700/30
             text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
    >
      <ArrowUpRight class="h-5 w-5" />
    </a>
  </div>
</div>