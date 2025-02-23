<!-- src/lib/layout/GridLayout.svelte -->
<script lang="ts">
  import Controls from '$lib/features/fomo/Controls.svelte';
  import News from '$lib/features/news/News.svelte';
  import Timeline from '$lib/features/fomo/Timeline.svelte';
  import type { LayoutOption, GridClasses } from '$lib/types/layout';

  let activeLayout = $state<LayoutOption['name']>('normal');
  let columnCount = $state(2);

  const gridClasses: Record<LayoutOption['name'], GridClasses> = {
    compact: {
      container: 'max-w-2xl px-4',
      main: 'md:grid-cols-12 gap-16',
      sidebar: 'md:col-span-3 bg-violet-900/10 -ml-44 mr-44',
      content: 'md:col-span-9 -ml-22 pr-44'
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

  const getGridClass = (count: number) =>
    count === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2';
  const gridClass = $derived(getGridClass(columnCount));
</script>

<div class="mx-auto {gridClasses[activeLayout].container}">
  <div class="grid grid-cols-1 {gridClasses[activeLayout].main} pb-32">
    <!-- Sidebar -->
    <div class="{gridClasses[activeLayout].sidebar}">
      <div class="sticky top-18 flex flex-col gap-12"> <!-- This gives us sticky behavior -->
        <Controls bind:activeLayout bind:columnCount />
        <Timeline />
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