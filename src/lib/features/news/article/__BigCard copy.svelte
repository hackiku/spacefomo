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
  <div class="rounded-2xl bg-zinc-900 border border-zinc-800/50 overflow-hidden">
    <!-- Close button (if in modal) -->
    {#if onClose}
      <button
        type="button"
        class="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors z-10"
        onclick={onClose}
        aria-label="Close"
      >
        <X class="h-5 w-5" />
      </button>
    {/if}
    
    <!-- Header -->
    <div class="relative px-8 pt-8 pb-6 border-b border-zinc-800/50">
      <!-- FOMO score -->
      <div class="absolute top-6 right-16 flex items-center">
        <div class="text-2xl font-semibold bg-clip-text text-transparent
                   bg-gradient-to-br from-violet-400 to-fuchsia-500">
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
    <div class="absolute bottom-0 left-0 right-0 px-8 py-4 border-t border-zinc-800/50 bg-zinc-900/95 backdrop-blur-sm flex items-center justify-between z-10">
      <Button.Root
        class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm
               bg-zinc-800/50 border border-zinc-700/30 text-zinc-400
               hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
        onclick={() => showJson = !showJson}
        aria-label={showJson ? "Hide details" : "Show details"}
      >
        <CaretDown class={`h-4 w-4 transition-transform ${showJson ? 'rotate-180' : ''}`} />
        <span>{showJson ? 'Hide Raw Data' : 'Show Raw Data'}</span>
      </Button.Root>

      <div class="flex items-center gap-3">
        <Button.Root
          class="flex items-center justify-center h-10 w-10 rounded-full
                 bg-zinc-800/50 border border-zinc-700/30 text-zinc-400
                 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
          onclick={copyUrl}
          aria-label="Copy article URL"
        >
          <Copy class="h-5 w-5" />
        </Button.Root>
        
        <Button.Root
          href={`/news/${article.slug || article.id}`}
          class="flex items-center justify-center h-10 w-10 rounded-full
                 bg-zinc-800/50 border border-zinc-700/30 text-zinc-400
                 hover:bg-zinc-700 hover:text-zinc-200 hover:border-zinc-600
                 transition-all duration-200"
          aria-label="View article details"
        >
          <ArrowUpRight class="h-5 w-5" />
        </Button.Root>
        
        <Button.Root
          href={article.url}
          class="flex items-center gap-2 px-4 py-2 rounded-lg 
                 bg-zinc-800/50 border border-zinc-700/30 text-zinc-200
                 hover:bg-zinc-700 transition-colors"
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