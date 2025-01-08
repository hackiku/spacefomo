<!-- $lib/features/fomo/WeeklyFomo.svelte -->
<script lang="ts">
  import FomoBar from './FomoBar.svelte';
  // import type { FomoScore } from '$lib/types';
  
  // Weekly data structure
  // export let weeklyScores: FomoScore[] = [];
  export let weeklyScores = [];
  export let currentWeekScore = 86;
  export let nextUpdateTime = 604800; // 1 week in seconds

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
    console.log('Selected date:', event.detail);
    // TODO: Update visualization based on selected date
  }
</script>

<div class="relative">
  <!-- Vaporwave-inspired background elements -->
  <div class="absolute inset-0 bg-gradient-to-r from-[#756BFF]/5 to-[#FF6AD5]/5">
    <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
    <div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#756BFF]/50 via-[#FF6AD5]/50 to-[#26C6DA]/50"></div>
  </div>

  <!-- Content -->
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-white mb-2">Weekly Space FOMO Index</h2>
      <p class="text-[#FF6AD5] font-mono">Tracking collective space anxiety since 2024</p>
    </div>

    <FomoBar 
      currentScore={currentWeekScore}
      remainingTime={nextUpdateTime}
      dates={weekDates}
      on:dateSelected={handleDateSelected}
    />
  </div>
</div>