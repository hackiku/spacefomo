<!-- src/lib/features/news/NewsApp.svelte -->
<script lang="ts">
  import NewsGrid from './layout/NewsGrid.svelte';
  import FomoApp from '$lib/features/fomo/FomoApp.svelte';
  import SidebarToggle from './layout/SidebarToggle.svelte';
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
      return 'max-w-3xl'; // Narrower content
    } else if (sidebarMode === 'wide') {
      return 'max-w-5xl'; // Wider content
    } else {
      return 'max-w-4xl'; // Default width
    }
  });
</script>

<div class="relative min-h-[calc(100vh-4rem)]">
  <!-- Main content -->
  <div class="container mx-auto px-4 sm:px-6 pb-20">
    <!-- Centered content wrapper -->
    <div class="mx-auto {getContainerClasses()} pt-6 sm:pt-8">
      <!-- Grid is content-agnostic, just displays the news -->
      <NewsGrid columnCount={columnCount} />
    </div>
  </div>
  
  <!-- Sidebar toggle component - independent of grid layout -->
  <SidebarToggle bind:sidebarMode bind:columnCount />
  
  <!-- FomoApp stays at the bottom within the NewsApp container -->
  <div class="absolute bottom-0 left-0 right-0 z-40 h-14">
    <FomoApp />
  </div>
</div>