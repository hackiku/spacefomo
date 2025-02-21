<!-- src/lib/components/layout/GridLayout.svelte -->
<script lang="ts">
  import type { LayoutConfig } from '$lib/types/layout';

  let { layout } = $props<{
    layout: LayoutConfig;
  }>();

  // Scroll tracking for sticky behavior
  let sidebarRef: HTMLDivElement;
  let controlsRef: HTMLDivElement;
  let isSticky = $state(false);
  let hasPassedThreshold = $state(false);

  // Enhanced scroll handling with intersection observer
  $effect(() => {
    if (!sidebarRef || !controlsRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isSticky = !entry.isIntersecting;
      },
      {
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px'
      }
    );

    observer.observe(sidebarRef);

    return () => observer.disconnect();
  });

  // Reactive classes with improved organization
  let gridClasses = $derived({
    container: [
      'mx-auto transition-all duration-300',
      layout.width === 'narrow' ? 'max-w-5xl' : 'max-w-7xl',
      {
        'compact': 'px-2 md:px-6',
        'normal': 'px-4 md:px-8',
        'wide': 'px-6 md:px-12'
      }[layout.padding]
    ].join(' '),

    sidebar: [
      'grid-area-sidebar space-y-6',
      isSticky ? 'lg:h-screen lg:overflow-auto' : ''
    ].join(' '),

    controls: [
      'space-y-6',
      isSticky ? 'lg:sticky lg:top-0 lg:z-10' : ''
    ].join(' '),

    news: [
      'grid-area-news grid gap-6',
      layout.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
    ].join(' ')
  });
</script>

<div class="grid-layout {gridClasses.container}">
  <!-- Left Sidebar: Controls + FOMO -->
  <div bind:this={sidebarRef} class={gridClasses.sidebar}>
    <!-- Controls Panel -->
    <div bind:this={controlsRef} class={gridClasses.controls}>
      <div class="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 p-6">
        <slot name="controls" />
      </div>
    </div>

    <!-- FOMO Card -->
    <div class="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800">
      <slot name="fomo" />
    </div>
  </div>

  <!-- News Feed -->
  <div class={gridClasses.news}>
    <slot name="news" />
  </div>
</div>

<style>
  .grid-layout {
    display: grid;
    gap: 1.5rem;
    
    /* Mobile: Stack everything */
    grid-template-areas:
      "sidebar"
      "news";
  }

  /* Desktop layout */
  @media (min-width: 1024px) {
    .grid-layout {
      grid-template-columns: minmax(280px, 1fr) minmax(0, 3fr);
      grid-template-areas: "sidebar news";
    }
  }

  .grid-area-sidebar { grid-area: sidebar; }
  .grid-area-news { grid-area: news; }
</style>