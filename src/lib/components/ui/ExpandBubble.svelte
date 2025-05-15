<!-- src/lib/components/ui/ExpandBubble.svelte -->
<script lang="ts">
  import { cn } from '$lib/utils';

  type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom';

  // Props using correct Svelte 5 syntax
  let { 
    position = 'bottom-right',
    expandedWidth = '320px',
    expandedHeight = 'auto',
    initiallyExpanded = false,
    showIndicator = true,
    bubbleSize = '3rem'
  } = $props<{
    position?: Position;
    expandedWidth?: string;
    expandedHeight?: string;
    initiallyExpanded?: boolean;
    showIndicator?: boolean;
    bubbleSize?: string;
  }>();

  // State for expanded status
  let isExpanded = $state(initiallyExpanded);
  
  // Toggle expanded state
  function toggleExpand() {
    isExpanded = !isExpanded;
  }
  
  // Calculate position classes based on the position prop
  const positionMap = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'left': 'left-4 top-1/2 -translate-y-1/2',
    'right': 'right-4 top-1/2 -translate-y-1/2',
    'top': 'top-4 left-1/2 -translate-x-1/2',
    'bottom': 'bottom-4 left-1/2 -translate-x-1/2'
  };
  
  const positionClasses = $derived(positionMap[position] || 'bottom-4 right-4');
</script>

<div 
  class={cn(
    "fixed z-40 transition-all duration-300 ease-in-out backdrop-blur-sm border border-border",
    positionClasses,
    isExpanded ? "bg-card rounded-lg shadow-lg" : "bg-muted/80 rounded-full",
    isExpanded ? "overflow-y-auto overflow-x-hidden" : "overflow-visible"
  )}
  style="
    width: {isExpanded ? expandedWidth : bubbleSize}; 
    height: {isExpanded ? expandedHeight : bubbleSize};
    max-height: {isExpanded ? 'calc(100vh - 6rem)' : bubbleSize};
  "
>
  <!-- Toggle Button (only shown if bubbleSized) -->
  <button 
    type="button"
    class={cn(
      "absolute inset-0 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-opacity duration-200",
      isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
    )}
    onclick={toggleExpand}
    aria-label={isExpanded ? "Collapse" : "Expand"}
  >
    <slot name="bubble-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"></path>
      </svg>
    </slot>
    
    {#if showIndicator && !isExpanded}
      <span class="absolute top-0 right-0 flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
      </span>
    {/if}
  </button>
  
  <!-- Close button when expanded -->
  {#if isExpanded}
    <button
      type="button"
      class="absolute top-2 right-2 p-1 rounded-full text-muted-foreground hover:text-foreground 
             bg-muted/30 hover:bg-muted transition-colors"
      onclick={toggleExpand}
      aria-label="Close"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18M6 6l12 12"></path>
      </svg>
    </button>
  {/if}
  
  <!-- Content container -->
  <div 
    class={cn(
      "w-full h-full transition-opacity duration-300",
      isExpanded ? "opacity-100 p-4" : "opacity-0 pointer-events-none"
    )}
  >
    <slot />
  </div>
</div>