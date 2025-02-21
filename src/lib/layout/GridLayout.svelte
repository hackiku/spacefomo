<!-- src/lib/components/layout/GridLayout.svelte -->
<script lang="ts">
  type LayoutConfig = {
    columns: 1 | 2;
    padding: 'compact' | 'normal' | 'wide';
    width: 'narrow' | 'normal' | 'wide';
  };

  let { layout } = $props<{
    layout: LayoutConfig;
  }>();

  // Scroll tracking for sticky behavior
  let controlsRef: HTMLDivElement;
  let isSticky = $state(false);
  let hasPassedThreshold = $state(false);

  // Use effect for scroll handling
  $effect(() => {
    const handleScroll = () => {
      if (!controlsRef) return;
      
      const rect = controlsRef.getBoundingClientRect();
      const threshold = window.innerHeight * 0.8; // 80% of viewport height
      
      isSticky = rect.top <= 0;
      hasPassedThreshold = window.scrollY > threshold;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

    controls: [
      'py-8',
      isSticky && !hasPassedThreshold ? 'sticky top-0 z-10' : ''
    ].join(' '),

    news: [
      'grid gap-6',
      layout.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
    ].join(' ')
  });
</script>

<div class="grid-layout {gridClasses.container}">
  <!-- Controls Panel with sticky behavior -->
  <div 
    bind:this={controlsRef}
    class="grid-area-controls {gridClasses.controls}
           transition-all duration-300"
  >
    <div class="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800">
      <slot name="controls" />
    </div>
  </div>

  <!-- Timeline Section -->
  <div class="grid-area-timeline">
    <slot name="timeline" />
  </div>

  <!-- News Feed -->
  <div class="grid-area-news {gridClasses.news}">
    <slot name="news" />
  </div>
</div>

<style>
  .grid-layout {
    display: grid;
    gap: 1.5rem;
    grid-template-areas:
      "controls"
      "news"
      "timeline";
  }

  @media (min-width: 768px) {
    .grid-layout {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "controls controls"
        "news news"
        "timeline timeline";
    }
  }

  @media (min-width: 1024px) {
    .grid-layout {
      grid-template-columns: minmax(280px, 1fr) minmax(0, 3fr);
      grid-template-rows: auto 1fr;
      grid-template-areas:
        "controls news"
        "timeline news";
    }
  }

  .grid-area-controls { grid-area: controls; }
  .grid-area-timeline { grid-area: timeline; }
  .grid-area-news { grid-area: news; }
</style>