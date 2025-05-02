<!-- src/lib/features/news/feed/NewsModal.svelte -->
<script lang="ts">
  import { X } from 'phosphor-svelte';
  import type { NewsItem } from '$lib/types/news';
  import BigCard from '../article/BigCard.svelte';
  
  let { article, isOpen, onClose } = $props<{
    article: NewsItem | null;
    isOpen: boolean;
    onClose: () => void;
  }>();
  
  // Handle escape key for closing modal
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && article}
  <div 
    role="dialog"
    aria-modal="true"
    class="fixed inset-2  z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:p-8"
  >
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      onclick={onClose}
      aria-hidden="true"
    ></div>

    <!-- Modal content -->
    <div class="relative w-full max-w-3xl mx-auto">
      <!-- Close button -->
      <button
        type="button"
        class="absolute -top-12 right-0 p-2 rounded-full bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors z-10"
        onclick={onClose}
        aria-label="Close modal"
      >
        <X class="h-5 w-5" />
      </button>

      <!-- Card -->
      <div class="transform transition-all">
        <BigCard {article} />
      </div>
    </div>
  </div>
{/if}