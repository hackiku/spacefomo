<!-- src/lib/features/news/article/SmallCard.svelte -->
<script lang="ts">
  import { ArrowUpRight } from 'phosphor-svelte';
  import type { NewsItem } from '$lib/types/news';
  import SmallTags from './data/SmallTags.svelte';
  
  let { article, onSelect } = $props<{ 
    article: NewsItem;
    onSelect: () => void;
  }>();

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
</script>

<div class="group w-full relative cursor-pointer">
  <!-- Card Container -->
  <button 
    type="button"
    class="w-full text-left transition-colors duration-200 block"
    onclick={onSelect}
    aria-label={`Open article: ${article.title}`}
  >
    <div class="p-5 rounded-xl border border-zinc-700/70 
                bg-zinc-900/50 backdrop-blur-sm 
                group-hover:border-zinc-600/70 group-hover:bg-zinc-800/70
                transition-all duration-200">
    
      <!-- Header with FOMO score and date -->
      <div class="flex items-start gap-3 mb-3">
        <!-- FOMO Score - no container, just text -->
        <span class="text-xl font-semibold bg-clip-text text-transparent
                    bg-gradient-to-br from-violet-400 to-fuchsia-500">
          {article.fomo_score || 0}
        </span>

        <!-- Date info -->
        <div class="flex items-center ml-auto">
          {#if article.publication_date}
            <span class="text-lg text-zinc-400">{formatDate(article.publication_date)}</span>
          {/if}
        </div>
      </div>
      
      <!-- Title -->
      <div class="mb-4">
        <h2 class="text-lg font-medium text-zinc-100 line-clamp-2">
          {article.viral_title || article.title}
        </h2>
      </div>

      <!-- Source -->
      <div class="mb-3">
        <span class="text-sm text-zinc-400">{article.source || 'Unknown'}</span>
      </div>

      <!-- Tags -->
      {#if article.tags?.length}
        <div class="flex flex-wrap gap-1.5">
          {#each article.tags.slice(0, 3) as tag}
            <span class="rounded-md bg-zinc-800/30 border border-zinc-800/40 px-2 py-0.5 text-xs text-zinc-400/50 truncate max-w-[120px]">
              #{tag}
            </span>
          {/each}
          {#if article.tags.length > 3}
            <span class="rounded-md bg-zinc-800/30 border border-zinc-800/40 px-2 py-0.5 text-xs text-zinc-400/50">
              +{article.tags.length - 3}
            </span>
          {/if}
        </div>
      {/if}
    </div>
  </button>
  
  <!-- External link button - moved to bottom-right and made bigger -->
  <a 
    href={`/news/${article.slug || article.id}`}
    class="absolute bottom-5 right-5 flex items-center justify-center h-9 w-9 rounded-full
           bg-zinc-800/80 border border-zinc-700/50 text-zinc-400
           group-hover:bg-zinc-700 group-hover:text-zinc-200 group-hover:border-zinc-600
           transition-all duration-200 z-10"
    aria-label="View article details"
  >
    <ArrowUpRight class="h-5 w-5" />
  </a>
</div>