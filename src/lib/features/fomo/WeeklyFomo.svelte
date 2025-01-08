<!-- src/lib/features/fomo/WeeklyFomo.svelte -->
<script lang="ts">
  import { fomoStore, wellSteepness } from '$lib/stores/fomoStore';
  import { onMount } from 'svelte';
  
  export let width = 400;
  export let height = 300;
  
  let container: HTMLDivElement;
  let points: Array<{x: number, y: number}> = [];
  
  // Calculate grid points based on FOMO score
  $: {
    const steepness = $wellSteepness;
    const centerX = width / 2;
    const centerY = height / 2;
    const gridSize = 20;
    
    points = [];
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const distortion = Math.min(30, (distance * steepness) / 5);
        const angle = Math.atan2(dy, dx);
        
        points.push({
          x: x + Math.cos(angle) * distortion,
          y: y + Math.sin(angle) * distortion
        });
      }
    }
  }
</script>

<div class="relative" bind:this={container}>
  <svg
    {width}
    {height}
    class="w-full h-full"
  >
    <!-- Grid Lines -->
    {#each points as point, i}
      <g>
        {#if i % (width/20 + 1) !== 0 && i > 0}
          <line
            x1={points[i-1].x}
            y1={points[i-1].y}
            x2={point.x}
            y2={point.y}
            stroke="#80808015"
            stroke-width="1"
          />
        {/if}
        {#if i >= width/20 + 1}
          <line
            x1={points[i-(width/20 + 1)].x}
            y1={points[i-(width/20 + 1)].y}
            x2={point.x}
            y2={point.y}
            stroke="#80808015"
            stroke-width="1"
          />
        {/if}
      </g>
    {/each}
    
    <!-- Well Center -->
    <circle
      cx={width/2}
      cy={height/2}
      r={40 * $wellSteepness}
      class="fill-blue-500/50"
    />
  </svg>
  
  <!-- FOMO Score Display -->
  <div 
    class="absolute inset-0 flex items-center justify-center text-center"
    style="pointer-events: none;"
  >
    <div>
      <div class="text-5xl font-bold text-zinc-100">
        {$fomoStore.currentScore}
      </div>
      <div class="text-sm text-zinc-400 mt-2">
        FOMO Level
      </div>
    </div>
  </div>
</div>

<style>
  svg {
    transform: rotate(0deg);
    transition: transform 0.3s ease-out;
  }
  
  svg:hover {
    transform: rotate(180deg);
  }
</style>