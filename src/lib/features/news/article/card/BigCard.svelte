<!-- src/lib/features/news/article/card/BigCard.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types/news';
  import { Copy, CaretDown } from 'phosphor-svelte';
  import ViralTitle from './ViralTitle.svelte';
  import Source from '../source/Source.svelte';
  import DevJson from './DevJson.svelte';
  
  let { article } = $props<{ article: NewsItem }>();
  let showJson = $state(true);
  
  function copyUrl() {
    navigator.clipboard.writeText(article.url);
  }

</script>

<div class="relative flex gap-4">
  <!-- Main Content -->
  <div class="flex-1 rounded-2xl bg-zinc-900 p-8">
    <div class="space-y-8">
      <!-- Viral Title - The AI-generated catchy title -->
      <ViralTitle title={article.title} viralTitle={article.viral_title} />

      <!-- Source info - original title, source, read time -->
      <Source 
        originalTitle={article.title} 
        source={article.source} 
        readTime={article.read_time} 
        publicationDate={article.publication_date}
      />

      <!-- Tags -->
      {#if article.tags?.length}
        <div class="flex flex-wrap gap-2">
          {#each article.tags as tag}
            <span class="rounded-full border border-zinc-800 px-3 py-1 text-sm text-zinc-400">
              {tag}
            </span>
          {/each}
        </div>
      {/if}

      <!-- Entities Grid -->
      <div class="grid grid-cols-2 gap-4">
        {#if article.entities?.companies}
          <div class="rounded-xl bg-zinc-800/30 p-4">
            <h3 class="text-sm font-medium text-zinc-300 mb-3">Organizations</h3>
            <div class="space-y-2">
              {#each article.entities.companies as org}
                <div class="text-sm">
                  <span class="text-zinc-200">{org.name}</span>
                  {#if org.role}<span class="text-zinc-500"> • {org.role}</span>{/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if article.entities?.people}
          <div class="rounded-xl bg-zinc-800/30 p-4">
            <h3 class="text-sm font-medium text-zinc-300 mb-3">Key People</h3>
            <div class="space-y-2">
              {#each article.entities.people as person}
                <div class="text-sm">
                  <span class="text-zinc-200">{person.name}</span>
                  {#if person.role}<span class="text-zinc-500"> • {person.role}</span>{/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4">
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg p-2 hover:bg-zinc-800 transition-colors"
            onclick={() => showJson = !showJson}
            aria-label={showJson ? "Hide details" : "Show details"}
          >
            <CaretDown class={`h-5 w-5 text-zinc-400 transition-transform ${showJson ? 'rotate-180' : ''}`} />
            <span class="text-sm text-zinc-500">{showJson ? 'Hide Data' : 'Show Data'}</span>
          </button>
          
          <div class="flex items-center gap-2">
            <div class="text-3xl font-medium bg-clip-text text-transparent
                        bg-gradient-to-br from-violet-400 to-fuchsia-500">
              {article.fomo_score || 0}
            </div>
            {#if article.impact_score}
              <div class="text-sm text-zinc-500">
                Impact {article.impact_score}
              </div>
            {/if}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="rounded-full p-2 hover:bg-zinc-800 transition-colors"
            onclick={copyUrl}
            aria-label="Copy article URL"
          >
            <Copy class="h-5 w-5 text-zinc-400" />
          </button>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-xl bg-zinc-800 px-6 py-2.5 text-sm text-zinc-100 
                   hover:bg-zinc-700 transition-colors"
          >
            Open Link
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- JSON Panel -->
  {#if showJson}
    <DevJson 
      data={{
        context: article.context,
        entities: article.entities
      }}
      onClose={() => showJson = false}
    />
  {/if}
</div>
