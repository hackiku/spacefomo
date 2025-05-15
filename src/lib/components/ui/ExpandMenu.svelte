<!-- src/lib/components/ui/ExpandMenu.svelte -->
<script lang="ts">
  import { cn } from '$lib/utils';

  // Props
  let {
    position = 'bottom',
    initiallyExpanded = false,
    closeOnClickOutside = true,
    zIndex = 30
  } = $props<{
    position?: 'top' | 'bottom' | 'left' | 'right';
    initiallyExpanded?: boolean;
    closeOnClickOutside?: boolean;
    zIndex?: number;
  }>();

  // State
  let isExpanded = $state(initiallyExpanded);
  let containerRef: HTMLDivElement;
  
  // Toggle expanded state
  function toggleExpanded(e: MouseEvent) {
    e.stopPropagation();
    isExpanded = !isExpanded;
  }
  
  // Close menu on click outside if enabled
  function handleClickOutside(e: MouseEvent) {
    if (!closeOnClickOutside || !isExpanded) return;
    
    if (containerRef && !containerRef.contains(e.target as Node)) {
      isExpanded = false;
    }
  }
  
  // Add event listeners
  $effect(() => {
    if (closeOnClickOutside) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  
  // Determine expansion container position classes
  const positionClasses = $derived(() => {
    switch (position) {
      case 'top': return 'bottom-full left-0 mb-2';
      case 'bottom': return 'top-full left-0 mt-2';
      case 'left': return 'right-full top-0 mr-2';
      case 'right': return 'left-full top-0 ml-2';
      default: return 'top-full left-0 mt-2';
    }
  });
</script>

<div class="relative" bind:this={containerRef}>
  <!-- Always visible content with onClick handler -->
  <div onclick={toggleExpanded} class="cursor-pointer">
    <slot />
  </div>
  
  <!-- Expandable content container (positioned absolutely) -->
  {#if isExpanded}
    <div 
      class={cn(
        "absolute z-" + zIndex,
        "rounded-2xl bg-background border border-border shadow-md",
        "animate-in slide-in-from-top-2 duration-200",
        positionClasses
      )}
    >
      <slot name="expanded" />
    </div>
  {/if}
</div>