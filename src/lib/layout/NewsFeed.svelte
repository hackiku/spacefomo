<!-- src/lib/layout/NewsFeed.svelte -->
<script lang="ts">
  import News from '$lib/features/news/News.svelte';
  import TabsTimeline from '$lib/features/fomo/timeline/TabsTimeline.svelte';
  import Sidebar from '$lib/features/sidebar/Sidebar.svelte';
  import type { SidebarMode, CardWidth, ColumnCount } from '$lib/types/layout';

  // Layout state
  let sidebarMode = $state<SidebarMode>('default');
  let cardWidth = $state<CardWidth>('normal');
  let columnCount = $state<ColumnCount>(1);

  // Get content width based on feed width setting
  const contentMaxWidth = $derived(() => {
    switch (sidebarMode) {
      case 'thin': return 'max-w-3xl'; // Narrow feed
      case 'wide': return 'max-w-6xl'; // Wide feed
      default: return 'max-w-4xl'; // Medium feed
    }
  });

  // Get sidebar width based on sidebar mode
  const sidebarWidth = $derived(() => {
    switch (sidebarMode) {
      case 'thin': return 'w-56'; // Narrower sidebar
      default: return 'w-72'; // Default sidebar width
    }
  });
</script>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
  <!-- Fixed/Sticky sidebar with flex layout -->
  <div class="flex flex-col md:flex-row">
    <!-- Sidebar -->
    <div class="md:sticky md:top-20 md:h-screen md:{sidebarWidth} flex-shrink-0 mb-8 md:mb-0 md:pr-8">
      <div class="overflow-auto">
        <Sidebar
          bind:sidebarMode
          bind:cardWidth
          bind:columnCount
        />
      </div>
    </div>
    
    <!-- Content -->
    <div class="flex-1">
      <div class="{contentMaxWidth} mx-autos">
        <News />
      </div>
    </div>
  </div>
</div>

<!-- Fixed positioned tabs timeline -->
<div class="sticky right-0 -bottom-1 left-0 z-50">
  <TabsTimeline />
</div>