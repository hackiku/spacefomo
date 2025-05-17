<!-- src/lib/features/news/article/SmallCard.svelte -->
<script lang="ts">
  import { ArrowUpRight } from 'phosphor-svelte';
  import { Button } from "bits-ui";
  import type { NewsItem } from '$lib/types/news';
  import { cn } from '$lib/utils';
  
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
  
  // Get FOMO color class based on score
  function getFomoColorClass(score: number): string {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-amber-500";
    if (score >= 40) return "text-orange-500";
    return "text-muted-foreground";
  }
</script>

<div class="group w-full relative">
  <!-- Card Container with side-by-side layout -->
  <div class="flex rounded-default overflow-hidden transition-all duration-200 border border-border group-hover:border-venus-yellow/30">
    <!-- Left sidebar with FOMO score and date -->
    <div class="bg-card/30 backdrop-blur-sm flex flex-col items-center justify-between py-4 px-3 min-w-[60px] text-center border-r border-border/50">
      <!-- FOMO Score -->
      <div class="flex flex-col items-center">
        <span class={cn("text-xl font-semibold", getFomoColorClass(article.fomo_score || 0))}>
          {article.fomo_score || 0}
        </span>
        <span class="text-xs text-muted-foreground">FOMO</span>
      </div>

      <!-- Date info -->
      {#if article.publication_date}
        <span class="text-xs text-muted-foreground mt-2">{formatDate(article.publication_date)}</span>
      {/if}
    </div>
    
    <!-- Main content area -->
    <Button.Root
      onclick={onSelect}
      class="flex-1 text-left p-5 bg-card/60 backdrop-blur-sm group-hover:bg-card transition-all duration-200"
      aria-label={`Open article: ${article.title}`}
    >
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
    </Button.Root>
  </div>
  
  <!-- External link button - positioned at bottom-right -->
  <Button.Root
    href={`/news/${article.slug || article.id}`}
    class="absolute bottom-5 right-5 flex items-center justify-center h-9 w-9
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
  </Button.Root>
</div>