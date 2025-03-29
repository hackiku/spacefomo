<!-- src/lib/layout/NewsFeed.svelte -->
<script lang="ts">
  import News from '$lib/features/news/News.svelte';
  import TabsTimeline from '$lib/features/fomo/timeline/TabsTimeline.svelte';
  import Sidebar from '$lib/features/sidebar/Sidebar.svelte';
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
      return 'max-w-[60vh] mr-[12vh]'; // Centered, narrow
    } else if (sidebarMode === 'wide') {
      return 'max-w-2xl'; // Wide, not necessarily centered
    } else {
      return 'max-w-[60vw] mr-[30vh]'; // Centered, medium width
    }
  });
  
  // Function to toggle sidebar open/closed
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Sidebar with toggle -->
    <div class="md:sticky md:top-20 md:h-[calc(100vh-5rem)] flex-shrink-0 mb-8 md:mb-0 
                {sidebarOpen ? 'md:w-48' : 'md:w-16'} transition-all duration-300">
      <div class="flex h-full">
        <!-- Toggle button -->
        <button 
          class="hidden md:flex absolute -right-3 top-4 w-6 h-6 rounded-full 
                 bg-zinc-800 text-zinc-300 items-center justify-center"
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
    
    <!-- Main content area -->
    <div class="flex-1 flex justify-center"> <!-- This flex container helps with centering -->
      <!-- Content container with explicit width control -->
      <div class="{getContainerClasses()} w-full">
        <News columnCount={columnCount} />
      </div>
    </div>
  </div>
</div>

<!-- Fixed timeline at bottom -->
<div class="sticky right-0 -bottom-1 left-0 z-50">
  <TabsTimeline />
</div>