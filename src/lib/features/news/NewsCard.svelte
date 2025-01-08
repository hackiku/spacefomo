<!-- $lib/features/news/NewsCard.svelte -->
<script lang="ts">
  import { ArrowUp, ArrowDown } from 'lucide-svelte';
  import NewsModal from './NewsModal.svelte';
  import type { NewsItem } from '$lib/types';
  import { cardStyles, type CardStyle } from './styles';
  
  export let item: NewsItem;
  export let style: CardStyle = 'terminal';

  let showModal = false;
  $: styles = cardStyles[style];

  function toggleModal() {
    showModal = !showModal;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleModal();
    }
  }
</script>

<div 
  class={styles.container}
  on:click={toggleModal}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
>
  <div class={styles.card}>
    <!-- Vote Controls -->
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <button 
        class={styles.score}
        on:click|stopPropagation
        aria-label="Upvote"
      >
        <ArrowUp size={20} />
      </button>
      <span class={styles.score}>{item.score}</span>
      <button 
        class={styles.score}
        on:click|stopPropagation
        aria-label="Downvote"
      >
        <ArrowDown size={20} />
      </button>
    </div>

    <!-- Content -->
    <h2 class={styles.title}>{item.title}</h2>
    <p class={styles.summary}>{item.summary}</p>

    <!-- Metadata -->
    <div class="flex items-center gap-4 mb-4">
      <span class={styles.meta}>{item.source}</span>
      <span class={styles.meta}>•</span>
      <span class={styles.meta}>{item.readTime} read</span>
    </div>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2">
      {#each item.tags as tag}
        <span class={styles.tag}>
          {tag}
        </span>
      {/each}
    </div>
  </div>
</div>

{#if showModal}
  <NewsModal {item} on:close={toggleModal} />
{/if}

<style>
  /* Any style-specific animations can go here */
</style>