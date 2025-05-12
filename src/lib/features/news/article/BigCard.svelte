<!-- src/lib/features/news/article/BigCard.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types/news';
  import { Copy, CaretDown, ArrowUpRight, X } from 'phosphor-svelte';
  import { Button, Tabs } from "bits-ui";
  import ViralTitle from './content/ViralTitle.svelte';
  import Summary from './content/Summary.svelte';
  import Source from './source/Source.svelte';
  import JsonData from './data/JsonData.svelte';
  import EntityTabs from './data/EntityTabs.svelte';
  import SmallTags from './data/SmallTags.svelte';
  import { onMount, onDestroy } from 'svelte';
  
  let { article, onClose } = $props<{ 
    article: NewsItem;
    onClose?: () => void;
  }>();
  
  let activeTab = $state('entities');
  
  // Prevent body scrolling when modal is open
  onMount(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  });
  
  onDestroy(() => {
    document.body.style.overflow = '';
  });
</script>

<div class="flex flex-col md:flex-row h-full bg-background">
  <!-- Main Content (left column) -->
  <div class="flex-1 flex flex-col relative">
    <!-- Close button (if in modal) -->
    {#if onClose}
      <Button.Root
        onclick={onClose}
        class="absolute top-4 right-4 p-2 z-30 bg-muted text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <X class="h-5 w-5" />
      </Button.Root>
    {/if}
    
    <!-- Header -->
    <div class="relative px-8 pt-8 pb-6">
      <!-- Viral Title with FOMO score displayed inline -->
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <ViralTitle title={article.title} viralTitle={article.viral_title} />
        </div>
        <div class="flex-shrink-0 ml-4">
          <div class="fomo-score text-2xl font-semibold">
            {article.fomo_score || 0}
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto hide-scrollbar px-8 pb-24">
      <div class="space-y-8"> 
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

        <!-- Entity Tabs (shown on mobile only) -->
        <div class="md:hidden">
          <EntityTabs entities={article.entities} context={article.context} />
        </div>
      </div>
    </div>

    <!-- Fixed Action Bar -->
    <div class="absolute bottom-0 left-0 right-0 px-8 py-4 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-between z-20">
      <!-- Tab controls for mobile view -->
      <div class="block md:hidden">
        <Tabs.Root bind:value={activeTab}>
          <Tabs.List class="flex gap-2">
            <Tabs.Trigger 
              value="entities"
              class="px-3 py-1 text-sm bg-muted text-muted-foreground data-[state=active]:text-foreground transition-colors"
            >
              Entities
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="json"
              class="px-3 py-1 text-sm bg-muted text-muted-foreground data-[state=active]:text-foreground transition-colors"
            >
              Raw Data
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>

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
          onclick={() => navigator.clipboard.writeText(article.url || '')}
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
  
  <!-- Right Sidebar with tabs for entity data and raw JSON (desktop only) -->
  <div class="hidden md:flex flex-col w-80 border-l border-border h-full">
    <Tabs.Root value="entities" class="h-full flex flex-col">
      <Tabs.List class="flex border-b border-border">
        <Tabs.Trigger 
          value="entities"
          class="flex-1 px-4 py-3 text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary transition-colors"
        >
          Entities
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="json"
          class="flex-1 px-4 py-3 text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary transition-colors"
        >
          Raw Data
        </Tabs.Trigger>
      </Tabs.List>
      
      <Tabs.Content value="entities" class="flex-1 overflow-auto p-4">
        <EntityTabs entities={article.entities} context={article.context} />
      </Tabs.Content>
      
      <Tabs.Content value="json" class="flex-1 overflow-auto">
        <JsonData 
          data={{
            context: article.context,
            entities: article.entities
          }}
          onClose={() => {}}
        />
      </Tabs.Content>
    </Tabs.Root>
  </div>
  
  <!-- Mobile Tabs Content (shown when tab selected) -->
  <div class="md:hidden fixed inset-0 z-10 bg-background" class:hidden={activeTab === 'entities'}>
    <div class="pt-20 px-4 pb-20 h-full overflow-auto">
      <JsonData 
        data={{
          context: article.context,
          entities: article.entities
        }}
        onClose={() => activeTab = 'entities'}
      />
    </div>
  </div>
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