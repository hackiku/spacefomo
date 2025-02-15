<!-- src/lib/features/news/Card.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types';
  import NewsScore from './NewsScore.svelte';
  
  export let item: NewsItem;
  export let onClick: (item: NewsItem) => void = () => {};

  const formatReadTime = (time?: number) => {
    if (!time) return '';
    return `${time} min read`;
  };

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(item);
    }
  }

  function handleUpvote() {
    console.log('Upvoted:', item.id);
    // TODO: Implement vote logic
  }

  function handleDownvote() {
    console.log('Downvoted:', item.id);
    // TODO: Implement vote logic
  }
</script>

<article class="group relative max-w-2xl mx-auto">
  <!-- Hover effect overlay -->
  <div 
    class="absolute -inset-1 rounded-2xl blur opacity-0 group-hover:opacity-100 
           transition-opacity duration-500 bg-gradient-to-r 
           dark:from-violet-600/20 dark:to-fuchsia-600/20
           light:from-violet-500/10 light:to-fuchsia-500/10" 
    aria-hidden="true"
  />
  
  <!-- Card container -->
  <div 
    class="relative rounded-2xl overflow-hidden border
           dark:bg-black/30 dark:border-white/10
           light:bg-white/30 light:border-black/10
           backdrop-blur-sm"
  >
    <div class="flex gap-6 p-6">
      <!-- Main content -->
      <button
        class="flex-1 text-left focus:outline-none focus-visible:ring-2 
               focus-visible:ring-violet-500/20 rounded-lg"
        on:click={() => onClick(item)}
        on:keydown={handleKeydown}
      >
        <!-- Title -->
        <h2 
          class="text-2xl font-medium tracking-tight mb-3 transition-colors
                 group-hover:text-transparent group-hover:bg-clip-text
                 dark:text-white dark:group-hover:bg-gradient-to-r 
                 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-400
                 light:text-black light:group-hover:bg-gradient-to-r 
                 light:group-hover:from-violet-600 light:group-hover:to-fuchsia-600"
        >
          {item.title || 'Untitled'}
        </h2>

        <!-- Metadata row -->
        {#if item.source || item.readTime}
          <div 
            class="flex flex-wrap items-center gap-4 text-sm mb-4
                   dark:text-zinc-500 light:text-zinc-600"
          >
            {#if item.source}
              <span>{item.source}</span>
              {#if item.readTime}
                <span 
                  class="dark:text-zinc-700 light:text-zinc-400" 
                  aria-hidden="true"
                >
                  •
                </span>
              {/if}
            {/if}
            {#if item.readTime}
              <span>{formatReadTime(item.readTime)}</span>
            {/if}
          </div>
        {/if}

        <!-- Tags -->
        {#if item.tags && item.tags.length > 0}
          <div 
            class="flex flex-wrap gap-2" 
            aria-label="Article tags"
          >
            {#each item.tags as tag}
              <span 
                class="px-3 py-1 text-xs font-medium rounded-full border 
                       transition-colors duration-300
                       dark:bg-zinc-900/50 dark:text-zinc-400 
                       dark:border-white/5 dark:group-hover:border-violet-500/20
                       light:bg-zinc-100/50 light:text-zinc-600 
                       light:border-black/5 light:group-hover:border-violet-500/20"
              >
                {tag}
              </span>
            {/each}
          </div>
        {/if}
      </button>

      <!-- Score section -->
      {#if typeof item.score !== 'undefined'}
        <div 
          class="flex items-center pl-6 border-l
                 dark:border-white/5 light:border-black/5"
        >
          <NewsScore 
            score={item.score}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
          />
        </div>
      {/if}
    </div>
  </div>
</article>