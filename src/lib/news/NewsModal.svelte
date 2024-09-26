<!-- $lib/components/NewsModal.svelte -->

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { ExternalLink, X } from 'lucide-svelte';
  import { Button } from "$lib/components/ui/button";
  import { spring } from 'svelte/motion';
  import { fade, fly } from 'svelte/transition';
  
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
  
  let sliderValue = spring(item.score, {
    stiffness: 0.1,
    damping: 0.6
  });
  let isDragging = false;
  let originalScore = item.score;

  function close() {
    dispatch('close');
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close();
    }
  }

  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  function updateScore(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const newValue = Math.round((x / rect.width) * 100);
    sliderValue.set(Math.max(0, Math.min(100, newValue)));
  }

  function startDragging() {
    isDragging = true;
  }

  function stopDragging() {
    isDragging = false;
    dispatch('scoreUpdate', { newScore: $sliderValue });
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" on:click={handleOutsideClick}>
  <div class="bg-gray-800 w-full max-w-3xl rounded-lg shadow-xl overflow-hidden" in:fly="{{ y: 50, duration: 500 }}" out:fade>
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
      
      <div class="flex items-center space-x-4">
        <Button on:click={() => window.open(item.url, '_blank')}>
          <ExternalLink size={16} class="mr-2" />
          Read post
        </Button>
        
        <div class="flex-1 relative h-12 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
             on:mousedown={startDragging}
             on:mouseup={stopDragging}
             on:mouseleave={stopDragging}
             on:mousemove={isDragging ? updateScore : null}>
          <div class="absolute inset-0 bg-white opacity-20" style="width: {originalScore}%"></div>
          <div class="absolute inset-0 bg-red-500" style="width: {$sliderValue}%"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-2xl font-bold">{Math.round($sliderValue)}</span>
          </div>
        </div>
      </div>
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

<style>
  .bg-red-500 {
    background-color: #ff4500;
  }
</style>