<!-- src/lib/features/news/Card.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types';
  import { newsStore } from '$lib/stores/newsStore';
  import NewsScore from './NewsScore.svelte';
  
  export let item: NewsItem;
  export let onClick = () => {};

  function handleUpvote() {
    // TODO: Implement upvote logic with newsStore
    console.log('Upvoted:', item.id);
  }

  function handleDownvote() {
    // TODO: Implement downvote logic with newsStore
    console.log('Downvoted:', item.id);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(item);
    }
  }
</script>

<article 
  class="group relative max-w-2xl mx-auto"
>
  <!-- Hover glow effect -->
  <div class="absolute -inset-1 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500
              dark:bg-gradient-to-r dark:from-violet-600/20 dark:to-fuchsia-600/20
              light:bg-gradient-to-r light:from-violet-500/10 light:to-fuchsia-500/10" 
       aria-hidden="true" />
  
  <!-- Main container -->
  <div class="relative rounded-2xl overflow-hidden border
              dark:bg-black/30 dark:backdrop-blur-sm dark:border-white/10
              light:bg-white/30 light:backdrop-blur-sm light:border-black/10">
    <div class="flex gap-6 p-6">
      <!-- Content -->
      <button
        class="flex-1 text-left focus:outline-none focus-visible:ring-2 
               focus-visible:ring-violet-500/20 rounded-lg"
        on:click={() => onClick(item)}
        on:keydown={handleKeydown}
      >
        <!-- Title -->
        <h2 class="text-2xl font-medium tracking-tight mb-3 transition-colors
                   dark:text-white dark:group-hover:text-transparent dark:group-hover:bg-clip-text
                   dark:group-hover:bg-gradient-to-r dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-400
                   light:text-black light:group-hover:text-transparent light:group-hover:bg-clip-text
                   light:group-hover:bg-gradient-to-r light:group-hover:from-violet-600 light:group-hover:to-fuchsia-600">
          {item.title}
        </h2>

        <!-- Metadata -->
        <div class="flex items-center gap-4 text-sm mb-4
                    dark:text-zinc-500 light:text-zinc-600">
          <span>{item.source}</span>
          <span class="dark:text-zinc-700 light:text-zinc-400" aria-hidden="true">•</span>
          <span>{item.readTime}</span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2" aria-label="Article tags">
          {#each item.tags as tag}
            <span class="px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-300
                        dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-white/5 dark:group-hover:border-violet-500/20
                        light:bg-zinc-100/50 light:text-zinc-600 light:border-black/5 light:group-hover:border-violet-500/20">
              {tag}
            </span>
          {/each}
        </div>
      </button>

      <!-- FOMO Score -->
      <div class="flex items-center pl-6 border-l
                  dark:border-white/5 light:border-black/5">
        <NewsScore 
          score={item.score}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      </div>
    </div>
  </div>
</article>