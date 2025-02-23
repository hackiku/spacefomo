<!-- src/lib/features/news/card/BigCard.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/stores/newsStore';
  import { newsStore } from '$lib/stores/newsStore';
  
  export let article: NewsItem;
  
  function handleClose() {
    newsStore.setActiveItem(null);
  }
</script>

<div 
	type="button"
  class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-20"
  on:click={handleClose}
>
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />

  <!-- Card -->
  <div 
    class="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-zinc-900 p-8"
    on:click|stopPropagation
  >
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-medium text-zinc-100">
        {article.title}
      </h2>
      <div class="mt-2 flex items-center gap-3 text-sm text-zinc-500">
        <span>{article.source}</span>
        <span class="text-zinc-700">•</span>
        <span>{article.readTime} min read</span>
        <span class="text-zinc-700">•</span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>
    </div>

    <!-- Tags -->
    {#if article.tags?.length}
      <div class="mb-6 flex flex-wrap gap-2">
        {#each article.tags as tag}
          <span class="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
            {tag}
          </span>
        {/each}
      </div>
    {/if}

    <!-- Score -->
    <div class="absolute top-8 right-8">
      <div class="text-3xl font-medium bg-clip-text text-transparent
                  bg-gradient-to-br from-violet-400 to-fuchsia-500">
        {article.score}
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-8 flex justify-end gap-4">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 
               hover:bg-zinc-700 transition-colors"
      >
        Read Article
      </a>
      <button
        on:click={handleClose}
        class="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400
               hover:bg-zinc-800 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
</div>