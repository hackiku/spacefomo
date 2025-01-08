<!-- src/lib/App.svelte -->
<script lang="ts">
  import Hero from './components/Hero.svelte';
  import WeekSelector from './components/WeekSelector.svelte';
  import Card from './features/news/Card.svelte';
  import NewsModal from './features/news/NewsModal.svelte';
  import type { NewsItem } from './types';
  
  // Example news item for the manual card
  const featuredNews = {
    id: 'featured-1',
    title: 'SpaceX successfully lands Starship after orbital test flight',
    summary: 'In a historic achievement, SpaceX has successfully completed a full test flight of its Starship vehicle, marking a major milestone in the development of the world\'s most powerful rocket system.',
    source: 'Space News',
    readTime: '1 min read',
    url: '#',
    score: 95,
    date: '2024-01-08',
    tags: ['SpaceX', 'Starship', 'Launch'],
    dataPoints: [
      { label: 'Flight Duration', value: '1h 30m' },
      { label: 'Max Altitude', value: '250 km' },
      { label: 'Landing Accuracy', value: '< 100m' },
      { label: 'Reuse Timeline', value: '2 weeks' }
    ]
  };

  let selectedItem: NewsItem | null = null;

  function handleCardClick(item: NewsItem) {
    selectedItem = item;
  }

  function handleModalClose() {
    selectedItem = null;
  }
</script>

<main class="min-h-screen bg-zincs-900 text-zinc-100">
  <!-- Main content -->
  <Hero />
  <WeekSelector />
  
  <!-- Featured Card -->
  <section class="max-w-3xl mx-auto px-4 py-12">
    <Card 
      item={featuredNews} 
      onClick={handleCardClick}
    />
  </section>
  
  <!-- Modal -->
  {#if selectedItem}
    <NewsModal 
      item={selectedItem}
      on:close={handleModalClose}
    />
  {/if}
</main>