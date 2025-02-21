<script lang="ts">
  import Controls from '$lib/features/news/controls/Controls.svelte';
  import News from '$lib/features/news/News.svelte';
  import FomoCard from '$lib/features/fomo/score/FomoCard.svelte';
  import { fomoStore } from '$lib/features/fomo/stores/fomoStore';
  import type { LayoutOption, GridClasses } from '$lib/types/layout';
  
  let isSticky = $state(false);
  let sidebarRef: HTMLDivElement;
  let activeLayout = $state<LayoutOption['name']>('normal');
  
  // Grid layout configurations
  const gridClasses: Record<LayoutOption['name'], GridClasses> = {
    compact: {
      container: 'max-w-5xl px-4',
      main: 'grid-cols-12 gap-6',
      sidebar: 'col-span-3',
      content: 'col-span-9'
    },
    normal: {
      container: 'max-w-6xl px-6',
      main: 'grid-cols-12 gap-8',
      sidebar: 'col-span-4',
      content: 'col-span-8'
    },
    grid: {
      container: 'max-w-7xl px-8',
      main: 'grid-cols-12 gap-10',
      sidebar: 'col-span-5',
      content: 'col-span-7'
    },
    wide: {
      container: 'max-w-[96rem] px-12',
      main: 'grid-cols-12 gap-12',
      sidebar: 'col-span-6',
      content: 'col-span-6'
    }
  };
  
  $effect(() => {
    if (!sidebarRef) return;
    const observer = new IntersectionObserver(
      ([entry]) => isSticky = !entry.isIntersecting,
      { threshold: 0 }
    );
    observer.observe(sidebarRef);
    return () => observer.disconnect();
  });

  const currentWeek = $derived($fomoStore.weeks.find(w => w.weekNumber === $fomoStore.activeWeek));
</script>

<div class="mx-auto {gridClasses[activeLayout].container}">
  <div class="grid grid-cols-1 md:{gridClasses[activeLayout].main} pb-32">
    <!-- Left Column -->
    <div 
      bind:this={sidebarRef}
      class="space-y-4 transition-all duration-200 md:{gridClasses[activeLayout].sidebar}"
      class:md:sticky={isSticky}
      class:md:top-4={isSticky}
    >
      <Controls {activeLayout} />
      
      {#if currentWeek}
        <FomoCard
          weekNumber={currentWeek.weekNumber}
          dateRange={currentWeek.startDate.toLocaleDateString()}
          score={currentWeek.score}
          emoji={currentWeek.score >= 80 ? '🤯' : '🚀'}
          summary={currentWeek.summary}
        />
      {/if}
    </div>

    <!-- Right Column - News Grid -->
    <div class="md:{gridClasses[activeLayout].content} grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-screen">
      <News />
    </div>
  </div>
</div>