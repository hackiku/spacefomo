<!-- src/lib/features/news/card/SmallCard.svelte -->
<script lang="ts">
  import { CaretDown } from 'phosphor-svelte';
  import type { NewsItem } from '$lib/stores/newsStore';
  import { newsStore } from '$lib/stores/newsStore';
  
  export let article: NewsItem;
</script>

<button 
  class="group w-full text-left transition-transform hover:-translate-y-0.5"
  on:click={() => newsStore.setActiveItem(article.id)}
>
  <div 
    class="aspect-video p-6 rounded-2xl border border-zinc-800/50 
           bg-zinc-900/50 backdrop-blur-sm 
           group-hover:border-zinc-700/50 group-hover:bg-zinc-900/70
           transition-all duration-200"
  >
    <div class="h-full flex flex-col justify-between">
      <!-- Content section -->
      <div class="space-y-3">
        <h2 class="text-lg font-medium text-zinc-100 line-clamp-2">
          {article.title}
        </h2>
        
        <div class="flex items-center gap-3 text-sm text-zinc-500">
          <span>{article.source}</span>
          <span class="text-zinc-700">•</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>

      <!-- Footer with score -->
      <div class="flex justify-between items-end">
        <div class="text-sm text-zinc-600">
          <CaretDown class="h-4"/>
        </div>
        
        <div 
          class="text-2xl font-medium bg-clip-text text-transparent
                 bg-gradient-to-br from-violet-400 to-fuchsia-500
                 group-hover:from-violet-300 group-hover:to-fuchsia-400
                 transition-colors"
        >
          {article.score}
        </div>
      </div>
    </div>
  </div>
</button>