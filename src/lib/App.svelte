<!-- src/lib/App.svelte -->
<script lang="ts">
  import Hero from './components/Hero.svelte';
  import WeekSelector from './components/WeekSelector.svelte';
  import Card from './features/news/Card.svelte';
  import NewsModal from './features/news/NewsModal.svelte';
  import GravityWell from './components/GravityWell.svelte';
  import type { NewsItem } from './types';
  
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

<!-- Background Effect -->
<div class="relative overflow-hidden min-h-screen">
  <GravityWell />

  <main class="relative z-10">
    <!-- Main content -->
    <Hero />
    <WeekSelector />
    
    <!-- Featured Card -->
    <section class="container py-4">
			        <!-- Subtitle with terminal style -->
        <!-- <p class="relative text-center text-2xl text-blue-500/70 leading-relaxed mb-6 font-mono">
          <span class="text-blue-400">&gt;&gt;</span> news <span class="text-blue-300">1 minute</span> a pop.
        </p> -->

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
</div>

<style>
  :global(html) {
    overflow-x: hidden;
  }
</style>