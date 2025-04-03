<!-- src/lib/features/news/card/SmallCard.svelte -->
<script lang="ts">
  import { ArrowUpRight } from 'phosphor-svelte';
  import type { NewsItem } from '$lib/types/news';
  import { useNews } from '$lib/hooks';
  
  let { article } = $props<{ 
    article: NewsItem;
  }>();

  // Get the setActiveItem function from our hook
  const { setActiveItem } = useNews();

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
</script>

<button 
  type="button"
  class="group w-full text-left hover:-translate-y-0.5 transition-transform"
  onclick={() => setActiveItem(article.id)}
  aria-label={`Open article: ${article.title}`}
>
  <div class="p-4 rounded-2xl border border-zinc-800/50 
              bg-zinc-900/50 backdrop-blur-sm 
              group-hover:border-zinc-700/50 group-hover:bg-zinc-900/70
              transition-all duration-200">
    <div class="flex flex-col gap-3">
      <div class="space-y-2">
        <div class="flex justify-between items-start gap-4">
          <h2 class="text-lg font-medium text-zinc-100 line-clamp-2">
            {article.viral_title || article.title}
          </h2>
          <ArrowUpRight class="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between">
        <div class="flex items-center gap-3 text-sm text-zinc-500">
          <span>{article.source || 'Unknown source'}</span>
          {#if article.publication_date}
            <span class="text-zinc-700">•</span>
            <span>{formatDate(article.publication_date)}</span>
          {/if}
        </div>
        
        <div class="flex items-center gap-2">
          {#if article.impact_score}
            <span class="text-sm text-zinc-500">Impact {article.impact_score}</span>
          {/if}
          <div class="text-xl font-medium bg-clip-text text-transparent
                      bg-gradient-to-br from-violet-400 to-fuchsia-500
                      group-hover:from-violet-300 group-hover:to-fuchsia-400">
            {article.fomo_score || 0}
          </div>
        </div>
      </div>

      {#if article.tags?.length}
        <div class="flex flex-wrap gap-2">
          {#each article.tags.slice(0, 5) as tag}
            <span class="rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400 truncate max-w-[120px]">
              {tag}
            </span>
          {/each}
          {#if article.tags.length > 5}
            <span class="rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              +{article.tags.length - 5}
            </span>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</button>