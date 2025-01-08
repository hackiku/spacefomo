<!-- $lib/fomo/FomoMeter.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let currentScore: number;
  export let remainingTime: number;

  let radius = 120;
  let circumference = radius * Math.PI;
  $: dashOffset = circumference - (currentScore / 100) * circumference;

  function formatTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
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

<div class="flex flex-col items-center justify-center bg-gray-900 rounded-full p-4">
  <div class="relative w-64 h-32 mb-4">
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
      <span class="text-5xl font-bold text-white">{currentScore}</span>
      <span class="text-md text-gray-400">FOMO Score</span>
    </div>
  </div>
  <div class="text-center">
    <h2 class="text-lg font-semibold text-gray-400 mb-1">Next update in:</h2>
    <p class="text-xl font-bold text-white">{formatTime(remainingTime)}</p>
  </div>
</div>