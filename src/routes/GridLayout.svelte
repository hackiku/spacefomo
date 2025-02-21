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

  // Reactive classes based on layout configuration
  let gridClasses = $derived({
    container: [
      // Base classes
      'mx-auto transition-all duration-300',
      // Width variants
      layout.width === 'narrow' ? 'max-w-5xl' : 'max-w-7xl',
      // Padding variants
      {
        'compact': 'px-2 md:px-54',
        'normal': 'px-4 md:px-36',
        'wide': 'px-6 md:px-12'
      }[layout.padding]
    ].join(' '),

    news: [
      'grid gap-6',
      layout.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
    ].join(' ')
  });
</script>

<div class="grid-layout {gridClasses.container}">
  <!-- Controls Panel -->
  <div class="grid-area-controls py-8">
    <slot name="controls" />
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
    
    /* Mobile: Stack everything */
    grid-template-areas:
      "controls"
      "news"
      "timeline";
  }

  /* Tablet layout */
  @media (min-width: 768px) {
    .grid-layout {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "controls controls"
        "news news"
        "timeline timeline";
    }
  }

  /* Desktop layout */
  @media (min-width: 1024px) {
    .grid-layout {
      grid-template-columns: minmax(280px, 1fr) minmax(0, 3fr);
      grid-template-rows: auto 1fr;
      grid-template-areas:
        "controls news"
        "timeline news";
    }
  }

  /* Apply grid areas */
  .grid-area-controls { grid-area: controls; }
  .grid-area-timeline { grid-area: timeline; }
  .grid-area-news { grid-area: news; }
</style>