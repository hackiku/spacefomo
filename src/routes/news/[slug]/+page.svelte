<!-- src/routes/news/[slug]/+page.svelte -->
<script>
  import { browser } from '$app/environment';
  import { ArrowLeft } from 'phosphor-svelte';
  
  // Import existing components
  import ViralTitle from '$lib/features/news/card/ViralTitle.svelte';
  import DevJson from '$lib/features/news/card/DevJson.svelte';
  
  // Import source components
  import SourceContainer from '$lib/features/news/source/SourceContainer.svelte';
  
  // Import entity components
  import ArticleEntities from '$lib/features/news/article/ArticleEntities.svelte';
  import ArticleTimeline from '$lib/features/news/article/ArticleTimeline.svelte';

  // Import local components
  import SlugSidebar from './SlugSidebar.svelte';
  
  let { data } = $props();
  const { article } = data;
  
  let showJson = $state(false);
  
  // Analytics tracking on page view
  $effect(() => {
    if (browser) {
      // Analytics tracking would go here
    }
  });
</script>

<div class="max-w-5xl mx-auto px-4 py-12">
  <!-- Back button -->
  <div class="mb-8">
    <a href="/news" class="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
      <ArrowLeft class="w-5 h-5" />
      <span>Back to news</span>
    </a>
  </div>
  
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Main Content Column -->
    <div class="flex-1 space-y-10">
      <!-- Title -->
      <ViralTitle title={article.title} viralTitle={article.viral_title} />
      
      <!-- Source Container -->
      <SourceContainer {article} />
      
      <!-- Summary Section -->
      {#if article.summary}
        <div class="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 backdrop-blur-sm p-6">
          <h2 class="text-lg font-medium text-zinc-200 mb-4">Summary</h2>
          <p class="text-zinc-300 leading-relaxed">{article.summary}</p>
        </div>
      {/if}
      
      <!-- Entities -->
      <ArticleEntities entities={article.entities} />
      
      <!-- Timeline -->
      {#if article.context?.timeline}
        <ArticleTimeline timeline={article.context.timeline} />
      {/if}
      
      <!-- Raw Data Toggle Button -->
      <div class="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button 
          type="button"
          class="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          onclick={() => showJson = !showJson}
        >
          <span>{showJson ? 'Hide Raw Data' : 'Show Raw Data'}</span>
        </button>
      </div>
      
      <!-- JSON Data Panel -->
      {#if showJson}
        <div>
          <DevJson 
            data={{
              context: article.context,
              entities: article.entities
            }}
            onClose={() => showJson = false}
          />
        </div>
      {/if}
    </div>
    
    <!-- Sidebar -->
    <SlugSidebar {article} />
  </div>
</div>