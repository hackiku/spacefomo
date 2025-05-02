<!-- src/lib/features/news/article/BigCard.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types/news';
  import { Copy, CaretDown, ArrowUpRight } from 'phosphor-svelte';
  import ViralTitle from './title/ViralTitle.svelte';
  import Source from './source/Source.svelte';
  import DevJson from './info/DevJson.svelte';
  
  let { article } = $props<{ article: NewsItem }>();
  let showJson = $state(false);
  
  function copyUrl() {
    navigator.clipboard.writeText(article.url);
  }
</script>

<div class="relative">
  <!-- Main Content -->
  <div class="rounded-2xl bg-zinc-900 border border-zinc-800/50 overflow-hidden">
    <!-- Header -->
    <div class="relative px-8 pt-8 pb-6 border-b border-zinc-800/50">
      <!-- FOMO score -->
      <div class="absolute top-6 right-6 flex items-center gap-2">
        <div class="px-3 py-1.5 rounded-full bg-zinc-800/70 border border-zinc-700/50">
          <div class="text-2xl font-medium bg-clip-text text-transparent
                     bg-gradient-to-br from-violet-400 to-fuchsia-500">
            {article.fomo_score || 0}
          </div>
        </div>
        
        <a 
          href={`/news/${article.slug || article.id}`}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center h-10 w-10 rounded-full
                bg-zinc-800/70 border border-zinc-700/50 text-zinc-400
                hover:bg-zinc-700 hover:text-zinc-200 hover:border-zinc-600
                transition-all duration-200"
          aria-label="View article details"
        >
          <ArrowUpRight class="h-5 w-5" />
        </a>
      </div>
      
      <!-- Viral Title - The AI-generated catchy title -->
      <ViralTitle title={article.title} viralTitle={article.viral_title} />
    </div>

    <!-- Content -->
    <div class="p-8 space-y-8">
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
        <div class="flex flex-wrap gap-2">
          {#each article.tags as tag}
            <span class="rounded-full bg-zinc-800/50 border border-zinc-700/50 px-3 py-1 text-sm text-zinc-300">
              {tag}
            </span>
          {/each}
        </div>
      {/if}

      <!-- Entities Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#if article.entities?.companies}
          <div class="rounded-xl bg-zinc-800/20 border border-zinc-700/30 p-5">
            <h3 class="text-sm font-medium text-zinc-300 mb-3">Organizations</h3>
            <div class="space-y-2.5">
              {#each article.entities.companies as org}
                <div class="flex items-baseline justify-between">
                  <span class="text-zinc-200">{org.name}</span>
                  {#if org.role}<span class="text-zinc-500 text-sm">{org.role}</span>{/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if article.entities?.people}
          <div class="rounded-xl bg-zinc-800/20 border border-zinc-700/30 p-5">
            <h3 class="text-sm font-medium text-zinc-300 mb-3">Key People</h3>
            <div class="space-y-2.5">
              {#each article.entities.people as person}
                <div class="flex items-baseline justify-between">
                  <span class="text-zinc-200">{person.name}</span>
                  {#if person.role}<span class="text-zinc-500 text-sm">{person.role}</span>{/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        {#if article.entities?.technologies}
          <div class="rounded-xl bg-zinc-800/20 border border-zinc-700/30 p-5">
            <h3 class="text-sm font-medium text-zinc-300 mb-3">Technologies</h3>
            <div class="space-y-2.5">
              {#each article.entities.technologies as tech}
                <div class="flex items-baseline justify-between">
                  <span class="text-zinc-200">{tech.name}</span>
                  {#if tech.status}<span class="text-zinc-500 text-sm">{tech.status}</span>{/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-6 border-t border-zinc-800/50">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm
                 bg-zinc-800/50 border border-zinc-700/30 text-zinc-400
                 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
          on:click={() => showJson = !showJson}
          aria-label={showJson ? "Hide details" : "Show details"}
        >
          <CaretDown class={`h-4 w-4 transition-transform ${showJson ? 'rotate-180' : ''}`} />
          <span>{showJson ? 'Hide Raw Data' : 'Show Raw Data'}</span>
        </button>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex items-center justify-center h-10 w-10 rounded-full
                   bg-zinc-800/50 border border-zinc-700/30 text-zinc-400
                   hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
            on:click={copyUrl}
            aria-label="Copy article URL"
          >
            <Copy class="h-5 w-5" />
          </button>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-4 py-2 rounded-lg 
                   bg-zinc-800/50 border border-zinc-700/30 text-zinc-200
                   hover:bg-zinc-700 transition-colors"
          >
            <span>Open Original</span>
            <ArrowUpRight class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- JSON Panel -->
  {#if showJson}
    <div class="mt-4">
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