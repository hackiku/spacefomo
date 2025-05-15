<!-- src/lib/features/news/NewsApp.svelte -->
<script lang="ts">
  import NewsGrid from './feed/NewsGrid.svelte';
  import Sidebar from './feed/Sidebar.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';

  // State for layout configuration
  let sidebarMode = $state<SidebarMode>('default');
  let columnCount = $state<ColumnCount>(1);
  
  // Track when sidebar mode or column count changes
  $effect(() => {
    console.log('Layout updated:', { sidebarMode, columnCount });
  });
  
  // Get container classes based on layout mode
  const getContainerClasses = $derived(() => {
    if (sidebarMode === 'thin') {
      return 'max-w-lg'; // Narrower content
    } else if (sidebarMode === 'wide') {
      return 'max-w-3xl'; // Wider content
    } else {
      return 'max-w-2xl'; // Default width
    }
  });
</script>

<div class="relative min-h-[calc(100vh-4rem)]">
  <!-- Main container with grid layout for desktop -->
	<Sidebar bind:sidebarMode bind:columnCount />
  <div class="container mx-auto px-4 sm:px-6 pb-20 md:pl-16"> <!-- padding-left to account for collapsed sidebar on desktop -->
    <!-- Sidebar positioned here (left edge on desktop, top on mobile) -->
    <div class="relative">
      
      <!-- Content wrapper -->
      <div class="mx-auto {getContainerClasses()} md:pt-0">
        <!-- Grid is content-agnostic, just displays the news -->
        <NewsGrid columnCount={columnCount} />
      </div>
    </div>
  </div>
</div>