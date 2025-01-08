<!-- src/lib/App.svelte -->
<script lang="ts">
  import Hero from './components/Hero.svelte';
  import Card from './features/news/Card.svelte';
  import NewsFeed from './features/news/NewsFeed.svelte';
  import StyleSwitcher from './components/StyleSwitcher.svelte';
  import { mockNewsItems } from './data/newsData';
  
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
    tags: ['SpaceX', 'Starship', 'Launch']
  };
</script>

<main class="min-h-screen bg-zinc-900 text-zinc-100">
  <!-- Main content -->
  <Hero />
  
  <!-- Featured Card -->
  <section class="max-w-3xl mx-auto px-4 py-12">
    <Card item={featuredNews} />
  </section>
  
  <!-- Original News Feed with style switching -->
  <section class="max-w-3xl mx-auto px-4 pb-24">
    <div class="border-t border-zinc-800 pt-12">
      <h2 class="text-2xl font-medium mb-8">More Updates</h2>
      <NewsFeed newsItems={mockNewsItems} />
      <StyleSwitcher />
    </div>
  </section>
</main>