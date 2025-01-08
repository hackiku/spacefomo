<!-- $lib/features/news/NewsCard.svelte -->
<script lang="ts">
  import { ArrowUp, ArrowDown } from 'lucide-svelte';
  import NewsModal from './NewsModal.svelte';

  export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    tldr: string;
    score: number;
    url: string;
    tags: string[];
    source: string;
    readTime: string;
    dataPoints: { label: string; value: string }[];
  }

  export let item: NewsItem;
  let showModal = false;

  function toggleModal() {
    showModal = !showModal;
  }
</script>

<div class="bg-gray-700 bg-opacity-20 rounded-lg border border-gray-600 p-4 mb-4 cursor-pointer" on:click={toggleModal}>
  <div class="flex items-center mb-2">
    <button class="text-gray-400 hover:text-white mr-2" on:click|stopPropagation>
      <ArrowUp size={20} />
    </button>
    <span class="text-lg font-semibold {item.score > 0 ? 'text-red-500' : 'text-gray-400'}">
      {item.score}
    </span>
    <button class="text-gray-400 hover:text-white ml-2" on:click|stopPropagation>
      <ArrowDown size={20} />
    </button>
  </div>
  <h2 class="text-xl font-bold mb-2">{item.title}</h2>
  <p class="text-gray-300 mb-4">{item.summary}</p>
  <div class="flex flex-wrap gap-2">
    {#each item.tags as tag}
      <span class="bg-gray-700 bg-opacity-40 text-sm px-2 py-1 rounded">{tag}</span>
    {/each}
  </div>
</div>

{#if showModal}
  <NewsModal {item} on:close={toggleModal} />
{/if}