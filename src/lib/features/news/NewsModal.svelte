<!-- src/lib/features/news/NewsModal.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/stores/newsStore';
  import { newsStore } from '$lib/stores/newsStore';
  import BigCard from './card/BigCard.svelte';
  
  let { article } = $props<{ article: NewsItem }>();
  
  function handleClose() {
    newsStore.setActiveItem(null);
  }

  // Handle escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') handleClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div 
  role="dialog"
  aria-modal="true"
  class="fixed inset-12 z-50 flex items-start justify-center overflow-y-auto p-4"
>
  <button
    type="button"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm"
    onclick={handleClose}
		aria-label="Close modal"
  >
	</button>

  <div class="relative w-full max-w-7xl pt-8">
    <BigCard {article} />
  </div>
</div>