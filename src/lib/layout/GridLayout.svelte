<!-- src/lib/layout/GridLayout.svelte -->
<script lang="ts">
  import News from '$lib/features/news/News.svelte';
  import TabsTimeline from '$lib/features/fomo/timeline/TabsTimeline.svelte';
  import Sidebar from '$lib/features/sidebar/Sidebar.svelte';
  import type { LayoutOption, GridClasses } from '$lib/types/layout';
  // import { fomoStore } from '$lib/stores/fomoStore';

  // State using runes
  let activeLayout = $state<LayoutOption['name']>('normal');
  let columnCount = $state(2);

  // Grid layout classes based on selected layout option
  const gridClasses: Record<LayoutOption['name'], GridClasses> = {
    compact: {
      container: 'max-w-2xl px-4',
      main: 'md:grid-cols-12 gap-16',
      sidebar: 'md:col-span-3',
      content: 'md:col-span-9'
    },
    normal: {
      container: 'max-w-4xl',
      main: 'md:grid-cols-12 gap-20',
      sidebar: 'md:col-span-4',
      content: 'md:col-span-8'
    },
    wide: {
      container: 'max-w-7xl px-4 sm:px-12',
      main: 'md:grid-cols-12 gap-10',
      sidebar: 'md:col-span-4',
      content: 'md:col-span-8'
    }
  };

  // Derived grid class based on column count
  const gridClass = $derived(columnCount === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2');

  // Debugging log to ensure reactive updates work
  $effect(() => {
    console.log('Layout updated:', { activeLayout, columnCount, gridClass });
  });
</script>

<div class="mx-auto {gridClasses[activeLayout].container}">
  <div class="grid grid-cols-1 {gridClasses[activeLayout].main} pb-32">
    <!-- Sidebar -->
    <div class="{gridClasses[activeLayout].sidebar}">
      <div class="sticky top-18 flex flex-col gap-12">
        <Sidebar bind:activeLayout bind:columnCount />
      </div>
    </div>

    <!-- Content area -->
    <div class={gridClasses[activeLayout].content}>
      <div class="gap-6 {gridClass}">
        <News />
      </div>
    </div>
  </div>
</div>

<!-- Fixed positioned tabs timeline -->
<div class="sticky right-0 -bottom-1 left-0 z-50">
  <TabsTimeline />
</div>