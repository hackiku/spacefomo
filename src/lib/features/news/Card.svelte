<!-- src/lib/features/news/Card.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types'
  import { newsStore } from '$lib/stores/newsStore'
  
  export let item: NewsItem

  function handleClick() {
    window.open(item.url, '_blank')
  }
</script>

<article 
  class="group cursor-pointer border-b border-zinc-800 py-8 first:pt-0 last:border-none"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  tabindex="0"
>
  <div class="flex flex-col gap-4">
    <!-- Title -->
    <h2 class="text-3xl font-medium text-zinc-100 group-hover:text-zinc-300 transition-colors tracking-tight">
      {item.title}
    </h2>

    <!-- Summary -->
    <p class="text-xl text-zinc-400 leading-relaxed">
      {item.summary}
    </p>

    <!-- Metadata -->
    <div class="flex items-center gap-4 text-lg text-zinc-500">
      <span>{item.source}</span>
      <span>•</span>
      <span>{item.readTime}</span>
    </div>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2">
      {#each item.tags as tag}
        <span class="px-3 py-1.5 text-base bg-zinc-800 text-zinc-400 rounded-md">
          {tag}
        </span>
      {/each}
    </div>
  </div>
</article>