<!-- src/lib/features/news/source/TitleUrl.svelte -->
<script lang="ts">
  import { ArrowUpRight, Copy } from 'phosphor-svelte';
  
  let { title, url, copied = false, onCopyUrl } = $props<{
    title: string;
    url: string;
    copied?: boolean;
    onCopyUrl: () => void;
  }>();
  
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

<div class="flex h-18 px-4 items-center rounded-full border border-zinc-700/30 bg-zinc-800/20 backdrop-blur-sm overflow-hidden">
  <!-- Title and URL Container -->
  <div class="flex-1 pl-2 flex flex-col justify-center overflow-hidden">
    <!-- Title -->
    <h2 class="text-sm font-medium text-zinc-300 truncate">
      {title}
    </h2>
    
    <!-- URL -->
    <div class="flex items-center mt-0.5">
      <span class="text-xs text-zinc-500 truncate">{shortenUrl(url)}</span>
      {#if copied}
        <span class="ml-2 text-xs text-emerald-400">Copied</span>
      {/if}
    </div>
  </div>
  
  <!-- Button Container -->
  <div class="flex items-center gap-2">
    <!-- Copy Button -->
    <button
      type="button"
      onclick={onCopyUrl}
      class="flex aspect-square h-12 items-center justify-center rounded-full bg-zinc-800/60 border border-zinc-700/40
             text-zinc-300 transition-all hover:bg-zinc-700/70 hover:text-zinc-100"
      aria-label="Copy link"
    >
      <Copy class="h-5 w-5" />
    </button>
    
    <!-- Original Article Button -->
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class="flex aspect-square h-12 items-center justify-center rounded-full bg-zinc-800/60 border border-zinc-700/40
             text-zinc-300 transition-all hover:bg-zinc-700/70 hover:text-zinc-100"
      aria-label="Open original article"
    >
      <ArrowUpRight class="h-5 w-5" />
    </a>
  </div>
</div>