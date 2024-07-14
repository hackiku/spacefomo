<!-- $lib/components/FomoMeter.svelte -->

<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import Chart from 'chart.js/auto';

  export let remainingTime: number;
  export let currentScore: number;

  const endTime = writable(Date.now() + remainingTime);

  // Derived store for countdown timer
  const timeRemaining = derived(
    endTime,
    $endTime => $endTime - Date.now()
  );

  let chart;

  // Function to initialize the gauge chart
  function initChart() {
    const ctx = document.getElementById('fomoMeter').getContext('2d');
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [currentScore, 100 - currentScore],
          backgroundColor: ['#ff0000', '#e0e0e0']
        }]
      },
      options: {
        circumference: Math.PI,
        rotation: Math.PI,
        cutout: '70%',
        plugins: {
          tooltip: { enabled: false }
        }
      }
    });
  }

  // Function to update the gauge chart
  function updateChart() {
    chart.data.datasets[0].data = [currentScore, 100 - currentScore];
    chart.update();
  }

  onMount(() => {
    initChart();
    const interval = setInterval(() => {
      updateChart();
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<div class="absolute top-0 right-0 m-4 p-4 border border-gray-500 rounded-lg">
  <section class="text-center mt-8">
    <h1 class="text-2xl font-bold mb-4">Today's FOMO Score</h1>
    <div class="relative gauge-wrapper border border-gray-500 rounded-full">
      <canvas id="fomoMeter" width="200" height="100"></canvas>
      <div class="gauge-content">
        <span class="text-4xl font-bold">{currentScore}</span>
        <span class="text-lg">FOMO Score</span>
      </div>
    </div>
    <div class="mt-4">
      <h2 class="text-lg font-bold">Next update in:</h2>
      <div>
        {#if $timeRemaining > 0}
          <p class="text-2xl font-bold">
            {Math.floor($timeRemaining / (1000 * 60 * 60)) % 24}h 
            {Math.floor($timeRemaining / (1000 * 60)) % 60}m 
            {Math.floor($timeRemaining / 1000) % 60}s
          </p>
        {:else}
          <p class="text-2xl font-bold">Updating now...</p>
        {/if}
      </div>
    </div>
  </section>
</div>

<style>
  .gauge-wrapper {
    position: relative;
    width: 200px;
    height: 100px;
  }
  .gauge-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
