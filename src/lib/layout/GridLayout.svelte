<!-- src/lib/layout/GridLayout.svelte -->
<script lang="ts">
  import News from '$lib/features/news/News.svelte';
  import TabsTimeline from '$lib/features/fomo/timeline/TabsTimeline.svelte';
  import Sidebar from '$lib/features/sidebar/Sidebar.svelte';
  import type { SidebarMode, CardWidth, ColumnCount } from '$lib/types/layout';

  // Layout state
  let sidebarMode = $state<SidebarMode>('default');
  let cardWidth = $state<CardWidth>('normal');
  let columnCount = $state<ColumnCount>(1);

  // Derived values for layout classes
  const sidebarLayout = $derived(() => {
    // For 'thin' mode, sidebar is positioned outside the main grid
    if (sidebarMode === 'thin') {
      return {
        containerClass: 'px-4 sm:px-6 lg:px-8',
        sidebarClass: 'w-full md:w-64 flex-shrink-0 md:pr-6',
        contentClass: 'w-full md:flex-1 px-4'
      };
    }
    
    // For 'wide' mode, sidebar is positioned within the grid
    else if (sidebarMode === 'wide') {
      return {
        containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        sidebarClass: 'md:col-span-4 lg:col-span-3',
        contentClass: 'md:col-span-8 lg:col-span-9'
      };
    }
    
    // Default mode (balanced layout)
    else {
      return {
        containerClass: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
        sidebarClass: 'md:col-span-4 lg:col-span-3',
        contentClass: 'md:col-span-8 lg:col-span-8'
      };
    }
  });

  // Card width and column classes
  const cardWidthClass = $derived(cardWidth === 'wide' ? 'w-full' : 'max-w-xl mx-auto');
  const columnLayoutClass = $derived(columnCount === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2');
</script>

<div class={sidebarLayout.containerClass}>
  <!-- For thin layout, sidebar is outside the grid -->
  {#if sidebarMode === 'thin'}
    <div class="flex flex-col md:flex-row max-w-6xl mx-auto">
      <!-- Sidebar (outside grid) -->
      <div class={sidebarLayout.sidebarClass}>
        <div class="sticky top-20 flex flex-col gap-12">
          <Sidebar
            bind:sidebarMode
            bind:cardWidth
            bind:columnCount
          />
        </div>
      </div>
      
      <!-- Content (outside grid) -->
      <div class={sidebarLayout.contentClass}>
        <div class="grid {columnLayoutClass} gap-6">
          <News />
        </div>
      </div>
    </div>
  {:else}
    <!-- For default and wide layouts, use a grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 pb-32">
      <!-- Sidebar (inside grid) -->
      <div class={sidebarLayout.sidebarClass}>
        <div class="sticky top-20 flex flex-col gap-12">
          <Sidebar
            bind:sidebarMode
            bind:cardWidth
            bind:columnCount
          />
        </div>
      </div>
      
      <!-- Content (inside grid) -->
      <div class={sidebarLayout.contentClass}>
        <div class="grid {columnLayoutClass} gap-6">
          {#if columnCount === 1}
            <div class="{cardWidthClass}">
              <News />
            </div>
          {:else}
            <!-- For 2-column layout, don't apply card width constraints -->
            <News />
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Fixed positioned tabs timeline -->
<div class="sticky right-0 -bottom-1 left-0 z-50">
  <TabsTimeline />
</div>