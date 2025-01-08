<!-- $lib/features/news/NewsFeed.svelte -->
<script lang="ts">
  import NewsCard from './NewsCard.svelte';
  import type { NewsItem } from '$lib/types';
  import { currentStyle } from '$lib/stores/styleStore';
  import type { CardStyle } from './styles';
  
  export let newsItems: NewsItem[];

  const containerStyles: Record<CardStyle, string> = {
    terminal: 'border-l-2 border-[#00ff00]/30 pl-4',
    scifi: 'relative before:absolute before:-top-8 before:left-1/2 before:w-32 before:h-32 before:bg-gradient-to-b before:from-blue-500/20 before:to-transparent before:blur-2xl before:transform before:-translate-x-1/2'
  };
</script>

<section class="max-w-3xl mx-auto mt-8 px-4">
  <div class={containerStyles[$currentStyle]}>
    {#each newsItems as item (item.id)}
      <NewsCard {item} style={$currentStyle} />
    {/each}
  </div>
</section>