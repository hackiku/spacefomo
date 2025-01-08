<!-- $lib/App.svelte -->
<script lang="ts">
  import Hero from './components/Hero.svelte';
  import WeeklyFomo from './features/fomo/WeeklyFomo.svelte';
  import NewsFeed from './news/NewsFeed.svelte';
  import type { NewsItem } from './types';
  import { onMount } from 'svelte';
  
  let newsItems: NewsItem[] = [
    {
      id: "1",
      title: "W Boson Mystery Solved: Standard Model Prevails",
      summary: "Large Hadron Collider confirms W boson mass aligns with Standard Model predictions, contradicting earlier Fermilab results.",
      tldr: "LHC confirms W boson mass matches Standard Model, closing potential avenue for new physics theories.",
      score: 95,
      url: "https://example.com/w-boson-mystery-solved",
      tags: ["particle physics", "LHC", "Standard Model"],
      source: "CERN",
      readTime: "4m",
      dataPoints: [
        { label: "W Boson Mass", value: "80,360.2 ± 9.9 MeV" },
        { label: "Standard Model Prediction", value: "80,357 ± 6 MeV" }
      ]
    },
    // Add more news items as needed
  ];

  let currentScore = 86;
  let remainingTime = 604800; // 1 week in seconds
  
  let dates = Array.from({length: 7}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }).reverse();

  function handleDateSelected(event: CustomEvent<string>) {
    console.log('Selected date:', event.detail);
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-zinc-100">
  <!-- Hero section with Soviet aesthetic and FOMO component -->
  <div class="relative">
    <div class="absolute inset-0 bg-gradient-to-r from-[#CC0000]/20 to-[#F5E6D3]/20 mix-blend-multiply" />
    <Hero />
    <div class="relative w-full -mb-24 bg-gradient-to-r from-[#756BFF]/10 to-[#FF6AD5]/10">
      <div class="max-w-7xl mx-auto">
        <WeeklyFomo 
          currentWeekScore={currentScore}
          nextUpdateTime={remainingTime}
          weekDates={dates}
          on:dateSelected={handleDateSelected}
        />
      </div>
    </div>
  </div>

  <!-- News feed -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <NewsFeed {newsItems} />
  </div>
</div>