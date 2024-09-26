<!-- $lib/components/NewsModal.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ExternalLink, X } from 'lucide-svelte';
  import { Button } from "$lib/components/ui/button";
  
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
  
  const dispatch = createEventDispatcher();
  
  function close() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-gray-800 w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-2xl font-bold">{item.title}</h2>
        <button on:click={close} class="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <div class="mb-4">
        <p class="text-purple-400 font-semibold mb-2">TLDR</p>
        <p>{item.tldr}</p>
      </div>
      
      <div class="mb-4">
        <p>{item.summary}</p>
      </div>
      
      <div class="flex flex-wrap gap-2 mb-4">
        {#each item.tags as tag}
          <span class="bg-gray-700 bg-opacity-40 text-sm px-2 py-1 rounded">{tag}</span>
        {/each}
      </div>
      
      <div class="text-sm text-gray-400 mb-4">
        {item.readTime} read time • From {item.source}
      </div>
      
      <Button on:click={() => window.open(item.url, '_blank')}>
        <ExternalLink size={16} class="mr-2" />
        Read post
      </Button>
    </div>
    
    <div class="bg-gray-700 bg-opacity-20 p-6">
      <h3 class="text-lg font-semibold mb-4">Key Data Points</h3>
      <div class="grid grid-cols-2 gap-4">
        {#each item.dataPoints as point}
          <div>
            <p class="text-sm text-gray-400">{point.label}</p>
            <p class="text-lg font-semibold text-blue-400">{point.value}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>