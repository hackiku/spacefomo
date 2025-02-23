<!-- src/lib/features/news/card/BigCard.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/stores/newsStore';
  import { newsStore } from '$lib/stores/newsStore';
  import { Info } from 'phosphor-svelte';
  
	let { article } = $props<{ article: NewsItem }>();

  // export let article: NewsItem;
  let showJson = $state(false);
  
  function handleClose() {
    newsStore.setActiveItem(null);
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
</script>

<div 
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-8"
>
  <button
    type="button"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm"
    onclick={handleClose}
  />

  <div 
    class="relative flex w-full max-w-6xl gap-4 pt-8"
  >
    <!-- Main Content -->
    <div class="flex-1 rounded-2xl bg-zinc-900 p-8">
      <div class="mb-8">
        <h2 class="text-3xl font-medium text-zinc-100 mb-4">
          {article.viral_title || article.title}
        </h2>
        {#if article.viral_title}
          <p class="text-lg text-zinc-400">
            {article.title}
          </p>
        {/if}
      </div>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 mb-6">
        {#if article.source}
          <span>{article.source}</span>
          <span class="text-zinc-700">•</span>
        {/if}
        {#if article.read_time}
          <span>{article.read_time} min read</span>
          <span class="text-zinc-700">•</span>
        {/if}
        {#if article.publication_date}
          <span>Published {formatDate(article.publication_date)}</span>
        {/if}
      </div>

      {#if article.tags?.length}
        <div class="mb-8 flex flex-wrap gap-2">
          {#each article.tags as tag}
            <span class="rounded-full border border-zinc-800 px-3 py-1 text-sm text-zinc-400">
              {tag}
            </span>
          {/each}
        </div>
      {/if}

      <div class="grid grid-cols-2 gap-4 mb-8">
        {#if article.entities?.organizations}
          <div class="rounded-lg bg-zinc-800/50 p-4">
            <h3 class="text-sm font-medium text-zinc-300 mb-3">Organizations</h3>
            <div class="space-y-2">
              {#each article.entities.organizations as org}
                <div class="text-sm">
                  <span class="text-zinc-200">{org.name}</span>
                  <span class="text-zinc-500"> • {org.role}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if article.entities?.people}
          <div class="rounded-lg bg-zinc-800/50 p-4">
            <h3 class="text-sm font-medium text-zinc-300 mb-3">People</h3>
            <div class="space-y-2">
              {#each article.entities.people as person}
                <div class="text-sm">
                  <span class="text-zinc-200">{person.name}</span>
                  <span class="text-zinc-500"> • {person.role}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="rounded-full p-2 hover:bg-zinc-800 transition-colors"
            onclick={() => showJson = !showJson}
          >
            <Info class="h-5 w-5 text-zinc-400" />
          </button>
          
          <div class="flex items-center gap-2">
            <div class="text-3xl font-medium bg-clip-text text-transparent
                        bg-gradient-to-br from-violet-400 to-fuchsia-500">
              {article.fomo_score || 0}
            </div>
            {#if article.impact_score}
              <div class="text-sm text-zinc-500">
                Impact Score: {article.impact_score}
              </div>
            {/if}
          </div>
        </div>

        <div class="flex gap-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 
                   hover:bg-zinc-700 transition-colors"
          >
            Read Article
          </a>
          <button
            type="button"
            onclick={handleClose}
            class="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400
                   hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- JSON Panel -->
    {#if showJson}
      <div class="w-96 rounded-2xl bg-zinc-900 p-6 overflow-auto max-h-[90vh]">
        <h3 class="text-sm font-medium text-zinc-300 mb-4">Raw Data</h3>
        <pre class="text-xs text-zinc-400 whitespace-pre-wrap">{JSON.stringify({
          context: article.context,
          entities: article.entities
        }, null, 2)}</pre>
      </div>
    {/if}
  </div>
</div>