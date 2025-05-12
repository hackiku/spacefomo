<!-- src/lib/components/content/AboutDrawer.svelte -->
<script lang="ts">
  import { fly } from 'svelte/transition';
  import { X } from 'phosphor-svelte';
  import About from './About.svelte';
  import { Button } from 'bits-ui';
  
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
    class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
    onclick={onClose}
    transition:fly={{ duration: 200, opacity: 0 }}
  />
  
  <!-- Drawer -->
  <div 
    class="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 
           bg-card border-l border-border overflow-hidden
           flex flex-col"
    transition:fly={{ x: 400, duration: 250 }}
  >
    <!-- Header with close button -->
    <div class="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
      <h2 class="text-lg font-medium text-foreground">About</h2>
      <button
        onclick={onClose}
        class="group relative flex items-center justify-center h-8 w-8
               bg-muted text-muted-foreground
               hover:text-foreground transition-colors
               before:absolute before:inset-0
               before:border before:border-primary/10
               before:translate-x-0.5 before:translate-y-0.5
               before:transition-transform before:duration-300
               hover:before:translate-x-0 hover:before:translate-y-0
               cursor-pointer active:scale-95"
        aria-label="Close about drawer"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
    
    <!-- Scrollable content area -->
    <div class="flex-1 overflow-y-auto">
      <About />
    </div>
  </div>
{/if}