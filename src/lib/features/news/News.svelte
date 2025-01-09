<!-- src/lib/features/news/News.svelte -->

<script lang="ts">
  import { writable } from 'svelte/store';
  import Card from './Card.svelte';
  import NewsModal from './NewsModal.svelte';
  import type { NewsItem } from '$lib/types';
  import { newsStore } from '$lib/stores/newsStore';

  const columnCount = writable(2); // Default 2 columns
  
  // Column toggle logic
  function setColumns(count: 1 | 2 | 3) {
    columnCount.set(count);
  }
</script>

<div class="container py-12">
  <!-- Column Controls -->
  <div class="flex gap-2 mb-6">
    {#each [1, 2, 3] as cols}
      <button 
        class="px-3 py-1 rounded-lg border border-white/10 
               {$columnCount === cols ? 'bg-violet-500/20' : 'bg-zinc-800/50'}"
        on:click={() => setColumns(cols)}
      >
        {cols}
      </button>
    {/each}
  </div>

  <!-- News Grid -->
  <div class="grid gap-6" 
       class:grid-cols-1={$columnCount === 1}
       class:grid-cols-2={$columnCount === 2}  
       class:grid-cols-3={$columnCount === 3}>
    {#each $newsStore.items as item}
      <Card {item} />
    {/each}
  </div>
</div>