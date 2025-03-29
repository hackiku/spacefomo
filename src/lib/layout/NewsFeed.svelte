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
    
    // Don't auto-change column count, let user control it
  });

  // Calculate content width and positioning based on layout mode
  const contentStyles = $derived(() => {
    // Base container classes
    let containerClass = "flex-1";
    
    if (sidebarMode === 'thin') {
      // Thin layout: narrower centered content
      return {
        width: 'max-w-3xl', 
        padding: 'md:px-0 w-full mx-auto', // Center with auto margins
        position: 'center'
      };
    } else if (sidebarMode === 'wide') {
      // Wide layout: wider content that follows sidebar
      return {
        width: 'max-w-5xl',
        padding: 'w-full', // No centering padding
        position: 'left'
      };
    } else {
      // Default layout: medium centered content
      return {
        width: 'max-w-4xl',
        padding: 'md:px-0 w-full mx-auto', // Center with auto margins
        position: 'center'
      };
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
    <div class="md:sticky md:top-20 md:h-[calc(100vh-5rem)] flex-shrink-0 mb-8 md:mb-0 {sidebarOpen ? 'md:w-48' : 'md:w-16'} transition-all duration-300">
      <div class="flex h-full">
        <!-- Toggle button -->
        <button 
          class="hidden md:flex absolute -right-3 top-4 w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 items-center justify-center"
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
    
    <!-- Main content with explicit positioning classes -->
    <div class="flex-1">
      <!-- Content container with explicit width, padding and positioning -->
      <div class="{contentStyles.width} {contentStyles.padding}">
        <News columnCount={columnCount} />
      </div>
    </div>
  </div>
</div>

<!-- Fixed timeline at bottom -->
<div class="sticky right-0 -bottom-1 left-0 z-50">
  <TabsTimeline />
</div>