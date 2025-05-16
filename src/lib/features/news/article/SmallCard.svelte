<!-- src/lib/features/news/article/SmallCard.svelte -->
<script lang="ts">
  import { ArrowUpRight } from 'phosphor-svelte';
  import type { NewsItem } from '$lib/types/news';
  
  let { article, onSelect } = $props<{ 
    article: NewsItem;
    onSelect: () => void;
  }>();

  const formatDate = (date: string | Date | null) => {
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
    <div class="rounded-default p-5 border border-border
                bg-card/60 backdrop-blur-sm 
                group-hover:border-venus-yellow/30 group-hover:bg-card
                transition-all duration-200">
    
      <!-- Header with FOMO score and date -->
      <div class="flex items-start gap-3 mb-3">
        <!-- FOMO Score -->
        <span class="fomo-score text-xl font-semibold">
          {article.fomo_score || 0}
        </span>

        <!-- Date info -->
        <div class="flex items-center ml-auto">
          {#if article.publication_date}
            <span class="text-lg text-muted-foreground">{formatDate(article.publication_date)}</span>
          {/if}
        </div>
      </div>
      
      <!-- Title -->
      <div class="mb-4">
        <h2 class="text-lg font-medium text-foreground line-clamp-2">
          {article.viral_title || article.title}
        </h2>
      </div>

      <!-- Source -->
      <div class="mb-3">
        <span class="text-sm text-muted-foreground">{article.source || 'Unknown'}</span>
      </div>

      <!-- Tags -->
      {#if article.tags?.length}
        <div class="flex flex-wrap gap-1.5">
          {#each article.tags.slice(0, 3) as tag}
            <span class="bg-muted border border-border px-2 py-0.5 text-xs text-muted-foreground/70 truncate max-w-[120px]">
              #{tag}
            </span>
          {/each}
          {#if article.tags.length > 3}
            <span class="bg-muted border border-border px-2 py-0.5 text-xs text-muted-foreground/70">
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
    class="group absolute bottom-5 right-5 flex items-center justify-center h-9 w-9
           bg-muted border border-border text-muted-foreground
           group-hover:text-foreground group-hover:border-venus-yellow/30
           transition-all duration-200 z-10
           before:absolute before:inset-0
           before:border before:border-primary/10
           before:translate-x-0.5 before:translate-y-0.5
           before:transition-transform before:duration-300
           group-hover:before:translate-x-0 group-hover:before:translate-y-0"
    aria-label="View article details"
  >
    <ArrowUpRight class="h-5 w-5" />
  </a>
</div>