<!-- src/lib/features/news/News.svelte -->

<script lang="ts">
  import { writable } from 'svelte/store';
  import { Button } from "$lib/components/ui/button";
  import { 
    LayoutGrid, 
    Layout, // for 3 columns
    AlignJustify // for list view
  } from 'lucide-svelte';
  import Card from './Card.svelte';
  import NewsModal from './NewsModal.svelte';
  import { NEWS_ITEMS, ARTICLE_TYPES } from '$lib/data/news';
  import type { NewsItem } from '$lib/types';

  // Stores
  const columnCount = writable(2);
  let selectedItem: NewsItem | null = null;
  let selectedType: string | null = null;

  // Layout controls with icons
  const layouts = [
    { cols: 1, icon: AlignJustify, label: 'List view' },
    { cols: 2, icon: LayoutGrid, label: 'Grid view' },
    { cols: 3, icon: Layout, label: 'Wide view' }
  ];

  function handleCardClick(item: NewsItem) {
    selectedItem = item;
  }

  function filterByType(type: string | null) {
    selectedType = type;
  }

  $: filteredNews = selectedType 
    ? NEWS_ITEMS.filter(item => item.type === selectedType)
    : NEWS_ITEMS;
</script>

<div class="bg-gray-200/60 dark:bg-zinc-900/80 md:px-20">
  <div class="container">
    <!-- Controls Bar -->
    <div class="flex justify-between items-center mb-8 sticky top-0 z-10 
                bg-zinc-900/95 backdrop-blur-sm">
      <!-- Left: Type Filters -->
      <div class="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          class="text-zinc-400 hover:text-zinc-100 
                 {!selectedType ? 'bg-violet-500/20 text-zinc-100' : ''}"
          on:click={() => filterByType(null)}
        >
          All
        </Button>
        {#each Object.entries(ARTICLE_TYPES) as [key, value]}
          <Button 
            variant="ghost"
            size="sm"
            class="text-zinc-400 hover:text-zinc-100
                   {selectedType === value ? 'bg-violet-500/20 text-zinc-100' : ''}"
            on:click={() => filterByType(value)}
          >
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </Button>
        {/each}
      </div>

      <!-- Right: Layout Controls -->
      <div class="flex gap-1 bg-zinc-800/50 rounded-lg p-1">
        {#each layouts as { cols, icon: Icon, label }}
          <Button
            variant="ghost"
            size="icon"
            class="w-8 h-8 {$columnCount === cols ? 'bg-violet-500/20' : ''}"
            on:click={() => columnCount.set(cols)}
            aria-label={label}
          >
            <Icon class="w-4 h-4" />
          </Button>
        {/each}
      </div>
    </div>

    <!-- News Grid -->
    <div 
      class="grid gap-6 mx-auto"
      class:max-w-3xl={$columnCount === 1}
      class:grid-cols-1={$columnCount === 1}
      class:grid-cols-2={$columnCount === 2}
      class:grid-cols-3={$columnCount === 3}
    >
      {#each filteredNews as item (item.id)}
        <Card {item} onClick={handleCardClick} />
      {/each}
    </div>
  </div>
</div>

<!-- Modal -->
{#if selectedItem}
  <NewsModal 
    item={selectedItem}
    on:close={() => selectedItem = null}
  />
{/if}