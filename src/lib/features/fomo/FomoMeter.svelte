<!-- $lib/features/fomo/FomoMeter.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let currentScore: number;
  export let remainingTime: number;

  let radius = 120;
  let circumference = radius * Math.PI;
  $: dashOffset = circumference - (currentScore / 100) * circumference;

  function formatTime(time: number): string {
    const days = Math.floor(time / 86400);
    const hours = Math.floor((time % 86400) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  }

  let interval: number;

  onMount(() => {
    interval = setInterval(() => {
      remainingTime = Math.max(0, remainingTime - 1);
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="flex flex-col items-center justify-center p-8 rounded-xl bg-[#2C2C2C]/80 backdrop-blur-sm border border-[#756BFF]/20">
  <!-- Meter display -->
  <div class="relative w-64 h-32 mb-6">
    <svg class="w-full h-full" viewBox="0 0 256 128">
      <!-- Base track -->
      <path
        d="M8 128 A 120 120 0 0 1 248 128"
        fill="none"
        stroke="#756BFF"
        stroke-width="16"
        stroke-opacity="0.2"
      />
      <!-- Score indicator -->
      <path
        d="M8 128 A 120 120 0 0 1 248 128"
        fill="none"
        stroke="url(#gradient)"
        stroke-width="16"
        stroke-dasharray={circumference}
        stroke-dashoffset={dashOffset}
        stroke-linecap="round"
      />
      <!-- Gradient definition -->
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #756BFF" />
          <stop offset="50%" style="stop-color: #FF6AD5" />
          <stop offset="100%" style="stop-color: #26C6DA" />
        </linearGradient>
      </defs>
    </svg>
    
    <!-- Score display -->
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-5xl font-bold text-white font-mono">{currentScore}</span>
      <span class="text-md text-[#FF6AD5] uppercase tracking-wider">FOMO Score</span>
    </div>
  </div>

  <!-- Timer display -->
  <div class="text-center font-mono">
    <h2 class="text-[#26C6DA] text-sm uppercase tracking-wider mb-1">Next Update In</h2>
    <p class="text-xl text-white">{formatTime(remainingTime)}</p>
  </div>
</div>

<style>
  div {
    filter: drop-shadow(0 0 10px rgba(255, 106, 213, 0.2));
  }
</style>