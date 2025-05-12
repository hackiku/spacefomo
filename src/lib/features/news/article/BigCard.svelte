<!-- src/lib/features/news/article/BigCard.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types/news';
  import { Copy, CaretDown, ArrowUpRight, X } from 'phosphor-svelte';
  import { Button } from "bits-ui";
  import ViralTitle from './content/ViralTitle.svelte';
  import Summary from './content/Summary.svelte';
  import Source from './source/Source.svelte';
  import JsonData from './data/JsonData.svelte';
  import EntityTabs from './data/EntityTabs.svelte';
  import SmallTags from './data/SmallTags.svelte';
  
  let { article, onClose } = $props<{ 
    article: NewsItem;
    onClose?: () => void;
  }>();
  
  let showJson = $state(false);
  
  function copyUrl() {
    if (article?.url) {
      navigator.clipboard.writeText(article.url);
    }
  }
</script>

<div class="relative">
  <!-- Main Content -->
  <div class="bg-background overflow-hidden">
    <!-- Close button (if in modal) -->
    {#if onClose}
      <button
        type="button"
        class="absolute top-4 right-4 p-2 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
        onclick={onClose}
        aria-label="Close"
      >
        <X class="h-5 w-5" />
      </button>
    {/if}
    
    <!-- Header -->
    <div class="relative px-8 pt-8 pb-6 border-b border-border">
      <!-- FOMO score -->
      <div class="absolute top-6 right-16 flex items-center">
        <div class="fomo-score text-2xl font-semibold">
          {article.fomo_score || 0}
        </div>
      </div>
      
      <!-- Viral Title - The AI-generated catchy title -->
      <ViralTitle title={article.title} viralTitle={article.viral_title} />
    </div>

    <!-- Scrollable Content -->
    <div class="max-h-[70vh] overflow-y-auto hide-scrollbar">
      <div class="p-8 space-y-8 pb-24"> <!-- Added extra padding at bottom for fixed action bar -->
        <!-- Summary - if available -->
        {#if article.summary}
          <div class="mb-6">
            <Summary summary={article.summary} />
          </div>
        {/if}
        
        <!-- Source info - original title, source, read time -->
        <Source 
          originalTitle={article.title} 
          source={article.source} 
          readTime={article.read_time} 
          publicationDate={article.publication_date}
          url={article.url}
        />

        <!-- Tags -->
        {#if article.tags?.length}
          <div class="mb-4">
            <SmallTags tags={article.tags} limit={10} />
          </div>
        {/if}

        <!-- Entity Tabs (organized data display) -->
        <EntityTabs entities={article.entities} context={article.context} />
      </div>
    </div>

    <!-- Fixed Action Bar -->
    <div class="absolute bottom-0 left-0 right-0 px-8 py-4 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-between z-10">
      <Button.Root
        class="group relative flex items-center gap-1.5 px-3 py-2 text-sm
               bg-muted border border-border text-muted-foreground
               hover:bg-muted hover:text-foreground transition-colors
               before:absolute before:inset-0
               before:border before:border-primary/10
               before:translate-x-0.5 before:translate-y-0.5
               before:transition-transform before:duration-300
               hover:before:translate-x-0 hover:before:translate-y-0"
        onclick={() => showJson = !showJson}
        aria-label={showJson ? "Hide details" : "Show details"}
      >
        <CaretDown class={`h-4 w-4 transition-transform ${showJson ? 'rotate-180' : ''}`} />
        <span>{showJson ? 'Hide Raw Data' : 'Show Raw Data'}</span>
      </Button.Root>

      <div class="flex items-center gap-3">
        <Button.Root
          class="group relative flex items-center justify-center h-10 w-10
                 bg-muted border border-border text-muted-foreground
                 hover:bg-muted hover:text-foreground transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/10
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0"
          onclick={copyUrl}
          aria-label="Copy article URL"
        >
          <Copy class="h-5 w-5" />
        </Button.Root>
        
        <Button.Root
          href={`/news/${article.slug || article.id}`}
          class="group relative flex items-center justify-center h-10 w-10
                 bg-muted border border-border text-muted-foreground
                 hover:bg-muted hover:text-foreground transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/10
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0"
          aria-label="View article details"
        >
          <ArrowUpRight class="h-5 w-5" />
        </Button.Root>
        
        <Button.Root
          href={article.url}
          class="group relative flex items-center gap-2 px-4 py-2 
                 bg-muted border border-border text-foreground
                 hover:bg-muted/80 transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/10
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0"
        >
          <span>Open Original</span>
          <ArrowUpRight class="h-4 w-4" />
        </Button.Root>
      </div>
    </div>
  </div>

  <!-- JSON Panel -->
  {#if showJson}
    <div class="mt-4">
      <JsonData 
        data={{
          context: article.context,
          entities: article.entities
        }}
        onClose={() => showJson = false}
      />
    </div>
  {/if}
</div>

<style>
  /* Hide scrollbar while maintaining functionality */
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
</style>