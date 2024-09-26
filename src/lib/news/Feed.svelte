<!-- $lib/components/Feed.svelte -->

<script lang="ts">
  import NewsCard from './NewsCard.svelte';
  import type { NewsItem } from './NewsCard.svelte';

  export let newsItems: NewsItem[];
</script>

<section class="max-w-3xl mx-auto mt-8 px-4">
  {#each newsItems as item (item.id)}
    <NewsCard {item} />
  {/each}
</section>