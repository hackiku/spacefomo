<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Timeline from '$lib/features/fomo/week/Timeline.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import News from '$lib/features/news/News.svelte';
  import Controls from '$lib/features/news/controls/Controls.svelte';

  // Layout state management
  let layout = $state({
    columns: 1,
    padding: 'normal',
    width: 'normal'
  });

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

<div class="min-h-screen">
  <Hero />

  <div class="grid-layout {gridClasses.container}">
    <!-- Controls Panel -->
    <div class="grid-area-controls py-8">
      <Controls bind:layout />
    </div>

    <!-- Timeline Section -->
    <div class="grid-area-timeline">
      <Timeline />
    </div>

    <!-- News Feed -->
    <div class="grid-area-news {gridClasses.news}">
      <News />
    </div>
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