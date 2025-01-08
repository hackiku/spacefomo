<!-- $lib/App.svelte -->
<script lang="ts">
  import Hero from './components/Hero.svelte';
  import FomoBar from './features/fomo/FomoBar.svelte';
  import NewsFeed from './news/NewsFeed.svelte';
  import { onMount } from 'svelte';
  
  let currentScore = 86;
  let remainingTime = 15950;
  
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
  <!-- Hero section with Soviet aesthetic -->
  <div class="relative">
    <div class="absolute inset-0 bg-gradient-to-r from-[#CC0000]/20 to-[#F5E6D3]/20 mix-blend-multiply" />
    <Hero />
  </div>
  
  <!-- FOMO meter section with vaporwave aesthetic -->
  <div class="relative w-full mb-24 bg-gradient-to-r from-[#756BFF]/10 to-[#FF6AD5]/10">
    <div class="max-w-7xl mx-auto">
      <FomoBar 
        {currentScore}
        {remainingTime}
        {dates}
        on:dateSelected={handleDateSelected}
      />
    </div>
  </div>

  <!-- News feed -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <NewsFeed />
  </div>
</div>