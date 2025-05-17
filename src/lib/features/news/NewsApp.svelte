<!-- src/lib/features/news/NewsApp.svelte -->
<script lang="ts">
  import NewsGrid from './layout/NewsGrid.svelte';
  import Sidebar from './layout/Sidebar.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';

  // State for layout configuration - local component state
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
      return 'max-w-4xl'; // Wider content
    } else {
      return 'max-w-xl'; // Default width
    }
  });
</script>

<div class="relative min-h-[calc(100vh-4rem)]">
  <!-- Main container with grid layout for desktop -->
  <Sidebar bind:sidebarMode bind:columnCount />
  <div class="container mx-auto px-4 pb-20 sm:px-6 md:pl-16">
    <!-- Content wrapper -->
    <div class="mx-auto {getContainerClasses()} md:pt-0">
      <!-- Grid is content-agnostic, just displays the news -->
      <NewsGrid {columnCount} />
    </div>
  </div>
</div>