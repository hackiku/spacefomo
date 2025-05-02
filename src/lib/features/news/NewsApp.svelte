<!-- src/lib/features/news/NewsApp.svelte -->

<script lang="ts">
  import NewsGrid from './layout/NewsGrid.svelte';
  import FomoApp from '$lib/features/fomo/FomoApp.svelte';
  import Sidebar from './layout/Sidebar.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';

  // Layout state using $state rune for reactivity
  let sidebarMode = $state<SidebarMode>('default');
  let columnCount = $state<ColumnCount>(1);
  let sidebarOpen = $state(true);

  // Effect to handle sidebarMode changes
  $effect(() => {
    // When layout mode changes, handle sidebar state
    if (sidebarMode === 'thin') {
      // Compact layout: close sidebar
      sidebarOpen = false;
    } else {
      // Other layouts: open sidebar
      sidebarOpen = true;
    }
  });

  // Helper function to get container classes based on current layout
  const getContainerClasses = $derived(() => {
    if (sidebarMode === 'thin') {
      return 'mx-auto max-w-3xl'; // Centered, narrow
    } else if (sidebarMode === 'wide') {
      return 'lg:max-w-5xl'; // Wide, somewhat centered
    } else {
      return 'mx-auto max-w-4xl'; // Centered, medium width
    }
  });
  
  // Function to toggle sidebar open/closed
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<!-- Main container with padding for FomoApp -->
<div class="min-h-[calc(100vh-4rem)] pb-16"> <!-- 4rem is top nav, 16 is FomoApp height -->
  <div class="container mx-auto px-4 sm:px-6 lg:px-0">
    <div class="flex flex-col md:flex-row">
      <!-- Sidebar with toggle - moved more to the left -->
      <div class="md:sticky md:top-16 md:h-[calc(100vh-8rem)] flex-shrink-0 mb-8 md:mb-0 
                 {sidebarOpen ? 'md:w-44 lg:w-48' : 'md:w-14 lg:w-16'} transition-all duration-300">
        <div class="flex h-full">
          <!-- Toggle button -->
          <button 
            class="hidden md:flex absolute right-0 top-2 w-7 h-7 rounded-full 
                   bg-neutral-800/70 text-zinc-300 items-center justify-center"
            onclick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
          
          <!-- Sidebar content -->
          <div class="w-full overflow-x-hidden">
            <Sidebar
              sidebarMode={sidebarMode}
              columnCount={columnCount}
              compact={!sidebarOpen}
              onSidebarModeChange={(mode) => sidebarMode = mode}
              onColumnCountChange={(count) => columnCount = count}
            />
          </div>
        </div>
      </div>
      
      <!-- Main content area - more space in the middle -->
      <div class="flex-1">
        <div class="{getContainerClasses()}">
          <NewsGrid columnCount={columnCount} />
        </div>
      </div>
      
      <!-- Empty right spacing div to balance layout -->
      <div class="hidden lg:block lg:w-8"></div>
    </div>
  </div>
  
  <!-- Fixed FomoApp at bottom -->
  <div class="fixed -bottom-1 left-0 right-0 z-50 h-14">
    <FomoApp />
  </div>
</div>