<!-- src/lib/features/news/card/BigCard.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/stores/newsStore';
  import { newsStore } from '$lib/stores/newsStore';
  
  export let article: NewsItem;
  
  function handleClose() {
    newsStore.setActiveItem(null);
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
</script>

<div 
  class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-20"
  on:click={handleClose}
>
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />

  <div 
    class="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-zinc-900 p-8"
    on:click|stopPropagation
  >
    <div class="mb-6">
      <h2 class="text-2xl font-medium text-zinc-100">
        {article.viral_title || article.title}
      </h2>
      <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
        {#if article.source}
          <span>{article.source}</span>
          <span class="text-zinc-700">•</span>
        {/if}
        {#if article.read_time}
          <span>{article.read_time} min read</span>
          <span class="text-zinc-700">•</span>
        {/if}
        {#if article.publication_date}
          <span>Published {formatDate(article.publication_date)}</span>
        {/if}
      </div>
    </div>

    {#if article.tags?.length}
      <div class="mb-6 flex flex-wrap gap-2">
        {#each article.tags as tag}
          <span class="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
            {tag}
          </span>
        {/each}
      </div>
    {/if}

    {#if article.context}
      <div class="mb-6 rounded-lg bg-zinc-800/50 p-4">
        <h3 class="mb-2 text-sm font-medium text-zinc-300">Context</h3>
        <pre class="text-sm text-zinc-400 whitespace-pre-wrap">{JSON.stringify(article.context, null, 2)}</pre>
      </div>
    {/if}

    <div class="absolute top-8 right-8 flex flex-col items-end gap-2">
      <div class="text-3xl font-medium bg-clip-text text-transparent
                  bg-gradient-to-br from-violet-400 to-fuchsia-500">
        {article.fomo_score || 0}
      </div>
      {#if article.impact_score}
        <div class="text-sm text-zinc-500">
          Impact Score: {article.impact_score}
        </div>
      {/if}
    </div>

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