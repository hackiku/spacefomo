<!-- src/lib/features/news/card/SmallCard.svelte -->
<script lang="ts">
  import { CaretDown } from 'phosphor-svelte';
  import type { NewsItem } from '$lib/stores/newsStore';
  import { newsStore } from '$lib/stores/newsStore';
  
  export let article: NewsItem;

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
</script>

<button 
  class="group w-full text-left transition-transform hover:-translate-y-0.5"
  on:click={() => newsStore.setActiveItem(article.id)}
>
  <div class="aspect-video p-6 rounded-2xl border border-zinc-800/50 
              bg-zinc-900/50 backdrop-blur-sm 
              group-hover:border-zinc-700/50 group-hover:bg-zinc-900/70
              transition-all duration-200">
    <div class="h-full flex flex-col justify-between">
      <div class="space-y-3">
        <h2 class="text-lg font-medium text-zinc-100 line-clamp-2">
          {article.viral_title || article.title}
        </h2>
        
        <div class="flex items-center gap-3 text-sm text-zinc-500">
          <span>{article.source || 'Unknown source'}</span>
          {#if article.read_time}
            <span class="text-zinc-700">•</span>
            <span>{article.read_time} min read</span>
          {/if}
          {#if article.publication_date}
            <span class="text-zinc-700">•</span>
            <span>{formatDate(article.publication_date)}</span>
          {/if}
        </div>

        {#if article.tags?.length}
          <div class="flex flex-wrap gap-2">
            {#each article.tags.slice(0, 2) as tag}
              <span class="rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                {tag}
              </span>
            {/each}
            {#if article.tags.length > 2}
              <span class="rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                +{article.tags.length - 2}
              </span>
            {/if}
          </div>
        {/if}
      </div>

      <div class="flex justify-between items-end">
        <div class="text-sm text-zinc-600">
          <CaretDown class="h-4"/>
        </div>
        
        <div class="flex items-center gap-3">
          {#if article.impact_score}
            <span class="text-sm text-zinc-500">Impact {article.impact_score}</span>
          {/if}
          <div class="text-2xl font-medium bg-clip-text text-transparent
                      bg-gradient-to-br from-violet-400 to-fuchsia-500
                      group-hover:from-violet-300 group-hover:to-fuchsia-400
                      transition-colors">
            {article.fomo_score || 0}
          </div>
        </div>
      </div>
    </div>
  </div>
</button>