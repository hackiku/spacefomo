<!-- src/lib/components/cta/content/AboutDrawer.svelte -->
<script lang="ts">
  import { fly } from 'svelte/transition';
  import About from './About.svelte';
  
  let { isOpen = false, onClose } = $props<{
    isOpen: boolean;
    onClose: () => void;
  }>();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 z-40 bg-black/20"
    onclick={onClose}
    transition:fly={{ duration: 150, opacity: 0 }}
  />
  
  <!-- Drawer -->
  <div 
    class="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 
           bg-zinc-900 border-l border-zinc-800 overflow-y-auto"
    transition:fly={{ x: 300, duration: 200 }}
  >
    <About />
  </div>
{/if}