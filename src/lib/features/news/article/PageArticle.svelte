<!-- src/lib/features/news/article/PageArticle.svelte -->

<!-- src/lib/features/news/article/PageArticle.svelte -->
<script lang="ts">
  import { ArrowLeft, Copy } from 'phosphor-svelte';
  import type { NewsItem } from '$lib/types/news';
  import { Button } from "bits-ui";
  
  // Import components
  import ViralTitle from './content/ViralTitle.svelte';
  import Summary from './content/Summary.svelte';
  import Source from './source/Source.svelte';
  import JsonData from './data/JsonData.svelte';
  import EntityTabs from './data/EntityTabs.svelte';
  
  let { article } = $props<{ 
    article: NewsItem;
  }>();
  
  let showJson = $state(false);
  
  function copyUrl() {
    if (article?.url) {
      navigator.clipboard.writeText(article.url);
    }
  }
  
  // Generate a back link path
  const backPath = "/news";
</script>

<div class="max-w-5xl mx-auto">
  <!-- Back button -->
  <div class="mb-8">
    <a href={backPath} class="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
      <ArrowLeft class="w-5 h-5" />
      <span>Back to news</span>
    </a>
  </div>
  
  <div class="space-y-10">
    <!-- Header with Title -->
    <div class="relative">
      <!-- FOMO score (shown on mobile only, sidebar has it on desktop) -->
      <div class="absolute top-0 right-0 lg:hidden text-2xl font-semibold bg-clip-text text-transparent
                   bg-gradient-to-br from-violet-400 to-fuchsia-500">
        {article.fomo_score || 0}
      </div>
      
      <!-- Title -->
      <ViralTitle title={article.title} viralTitle={article.viral_title} />
    </div>
    
    <!-- Source info - original title, source, read time -->
    <Source 
      originalTitle={article.title} 
      source={article.source} 
      readTime={article.read_time} 
      publicationDate={article.publication_date}
      url={article.url}
    />
    
    <!-- Summary - if available -->
    {#if article.summary}
      <div class="mb-8">
        <Summary summary={article.summary} />
      </div>
    {/if}
    
    <!-- Entity Tabs (organized data display) -->
    <EntityTabs entities={article.entities} context={article.context} />
    
    <!-- Raw Data Toggle Button -->
    <div class="flex items-center justify-between pt-4 border-t border-zinc-800">
      <Button.Root
        class="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
        on:click={() => showJson = !showJson}
      >
        <span>{showJson ? 'Hide Raw Data' : 'Show Raw Data'}</span>
      </Button.Root>
      
      <!-- Action buttons on same row (mobile only) -->
      <div class="flex lg:hidden items-center gap-3">
        <Button.Root
          class="flex items-center justify-center h-10 w-10 rounded-full
                 bg-zinc-800/50 border border-zinc-700/30 text-zinc-400
                 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
          on:click={copyUrl}
          aria-label="Copy article URL"
        >
          <Copy class="h-5 w-5" />
        </Button.Root>
        
        <Button.Root
          href={article.url}
          class="flex items-center gap-2 px-4 py-2 rounded-lg 
                 bg-zinc-800/50 border border-zinc-700/30 text-zinc-200
                 hover:bg-zinc-700 transition-colors"
        >
          <span>Open Original</span>
        </Button.Root>
      </div>
    </div>
    
    <!-- JSON Data Panel -->
    {#if showJson}
      <div class="mt-4">
        <JsonData 
          data={{
            context: article.context,
            entities: article.entities,
            seo: article.seo
          }}
          onClose={() => showJson = false}
        />
      </div>
    {/if}
  </div>
</div>