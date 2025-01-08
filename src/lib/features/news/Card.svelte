<!-- src/lib/features/news/Card.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types'
  import { newsStore } from '$lib/stores/newsStore'
  // import FomoScore from '../FomoScore.svelte'
  import FomoScore from '$lib/features/fomo/FomoScore.svelte'
  
  export let item: NewsItem
  export let onClick = () => {}
</script>

<article 
  class="group max-w-2xl mx-auto cursor-pointer rounded-2xl border-3 border-zinc-800/50 
         hover:border-zinc-700/50 transition-colors duration-200 overflow-hidden"
>
  <div class="flex gap-6 p-6">
    <!-- Content -->
    <div class="flex-1" 
         on:click={() => onClick(item)}
         on:keydown={(e) => e.key === 'Enter' && onClick(item)}
         tabindex="0"
    >
      <!-- Title -->
      <h2 class="text-2xl font-medium text-zinc-100 group-hover:text-zinc-300 
                 transition-colors tracking-tight mb-3">
        {item.title}
      </h2>

      <!-- Metadata -->
      <div class="flex items-center gap-4 text-base text-zinc-500 mb-4">
        <span>{item.source}</span>
        <span>•</span>
        <span>{item.readTime}</span>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2">
        {#each item.tags as tag}
          <span class="px-2.5 py-1 text-sm bg-zinc-800/50 text-zinc-400 
                     rounded-full border border-zinc-700/50">
            {tag}
          </span>
        {/each}
      </div>
    </div>

    <!-- FOMO Score -->
    <div class="flex items-center border-l border-zinc-800/50 pl-6">
      <FomoScore score={item.score} />
    </div>
  </div>
</article>