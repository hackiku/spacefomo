<!-- $lib/App.svelte -->
<script lang="ts">
  import Hero from './components/Hero.svelte';
  import WeeklyFomo from './features/fomo/WeeklyFomo.svelte';
  import NewsFeed from './features/news/NewsFeed.svelte';
  import StyleSwitcher from './components/StyleSwitcher.svelte';
  import { mockNewsItems } from './data/newsData';
  import type { FomoScore } from './types';
  
  // Weekly FOMO data
  let currentScore = 86;
  let nextUpdateTime = 604800; // 1 week in seconds
  
  // Generate week dates (Sunday to Saturday)
  let weekDates = Array.from({length: 7}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  });

  function handleDateSelected(event: CustomEvent<string>) {
    const selectedDate = event.detail;
    console.log('Selected date:', selectedDate);
  }
</script>

<main class="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-zinc-100">
  <!-- Soviet-style Hero with integrated FOMO meter -->
  <div class="relative">
    <div class="absolute inset-0 bg-gradient-to-r from-[#CC0000]/20 to-[#F5E6D3]/20 mix-blend-multiply" />
    
    <Hero />
    
    <div class="relative w-full -mb-24">
      <div class="absolute inset-0 bg-gradient-to-r from-[#756BFF]/10 to-[#FF6AD5]/10" />
      <div class="relative max-w-7xl mx-auto">
        <WeeklyFomo 
          {currentScore}
          nextUpdateTime={nextUpdateTime}
          dates={weekDates}
          on:dateSelected={handleDateSelected}
        />
      </div>
    </div>
  </div>

  <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <NewsFeed newsItems={mockNewsItems} />
    <StyleSwitcher />
  </section>
</main>