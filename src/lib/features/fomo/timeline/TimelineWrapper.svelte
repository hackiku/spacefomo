<!-- src/lib/features/fomo/timeline/TimelineWrapper.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  // Props
  let { 
    height = 120,
    isExpanded = false
  } = $props<{
    height?: number;
    isExpanded?: boolean;
  }>();
  
  // References
  let container: HTMLDivElement;
  let isScrolling = $state(false);
  let windowWidth = $state(0);
  
  // Handle scroll event with debounce
  function handleScroll() {
    isScrolling = true;
    
    // Reset the scrolling state after a timeout
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 150);
  }
  
  let scrollTimeout: ReturnType<typeof setTimeout>;
  
  // Handle window resize
  onMount(() => {
    const handleResize = () => {
      windowWidth = window.innerWidth;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  
  // Effect to scroll to center on initial load
  $effect(() => {
    if (container && windowWidth > 0) {
      // Wait a bit for rendering to complete
      setTimeout(() => {
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        
        // If there's more content than visible area, scroll to show recent data
        if (scrollWidth > clientWidth) {
          container.scrollLeft = scrollWidth - (clientWidth * 1.2);
        }
      }, 100);
    }
  });
</script>

<div 
  class="h-full w-full flex-1 overflow-x-auto no-scrollbar relative
         transition-opacity duration-300 hover:opacity-100
         {isExpanded ? 'opacity-100' : 'opacity-50'}"
  style:height="{height}px"
  on:scroll={handleScroll}
  bind:this={container}
>
  <!-- Mask elements for fade effects - these stay fixed relative to the container -->
  <div 
    class="absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
    style="background: linear-gradient(to right, var(--background), rgba(13, 11, 20, 0));">
  </div>
  <div 
    class="absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
    style="background: linear-gradient(to left, var(--background), rgba(13, 11, 20, 0));">
  </div>
  
  <!-- Content slot -->
  <slot></slot>
</div>

<style>
  /* Hide scrollbar but maintain functionality */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>