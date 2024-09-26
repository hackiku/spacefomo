<!-- $lib/components/FomoMeter.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let initialScore = 86;
  export let initialTime = 15950;

  let score = initialScore;
  let timeRemaining = initialTime;

  let radius = 120;
  let circumference = radius * Math.PI;
  $: dashOffset = circumference - (score / 100) * circumference;

  function formatTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  let interval: number;

  onMount(() => {
    interval = setInterval(() => {
      timeRemaining = Math.max(0, timeRemaining - 1);
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="flex flex-col items-center justify-center">
  <div class="relative w-64 h-32 mb-8">
    <svg class="w-full h-full" viewBox="0 0 256 128">
      <path
        d="M8 128 A 120 120 0 0 1 248 128"
        fill="none"
        stroke="#1f2937"
        stroke-width="16"
        stroke-opacity="0.3"
      />
      <path
        d="M8 128 A 120 120 0 0 1 248 128"
        fill="none"
        stroke="#ef4444"
        stroke-width="16"
        stroke-dasharray={circumference}
        stroke-dashoffset={dashOffset}
        stroke-linecap="round"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-5xl font-bold text-gray-800">{score}</span>
      <span class="text-md text-gray-600">FOMO Score Today</span>
    </div>
  </div>
  <div class="text-center">
    <h2 class="text-lg font-semibold text-gray-700 mb-2">Next update in:</h2>
    <p class="text-2xl font-bold text-gray-800">{formatTime(timeRemaining)}</p>
  </div>
</div>