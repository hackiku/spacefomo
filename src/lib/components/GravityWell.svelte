<!-- src/lib/components/GravityWell.svelte -->
<script lang="ts">
  import { fomoStore, wellSteepness } from '$lib/stores/fomoStore';
  import { onMount } from 'svelte';
  
  let container: HTMLDivElement;
  let width: number;
  let height: number;
  let points: Array<{x: number, y: number}> = [];
  
  $: {
    const steepness = $wellSteepness;
    const centerX = width / 2;
    const centerY = height / 2;
    const gridSize = Math.max(20, Math.min(width, height) / 20);
    
    points = [];
    for (let x = -gridSize; x <= width + gridSize; x += gridSize) {
      for (let y = -gridSize; y <= height + gridSize; y += gridSize) {
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

  onMount(() => {
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });
    
    observer.observe(container);
    return () => observer.disconnect();
  });
</script>

<div 
  class="fixed inset-0 -z-10 px-8 overflow-hidden"
  style="transform: rotate(-12deg) scale(1.2);"
>
  <div class="w-full h-full" bind:this={container}>
    <svg
      viewBox="0 0 {width} {height}"
      class="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="wellGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color: var(--well-color-center, hsl(var(--primary))); stop-opacity: 0.15" />
          <stop offset="100%" style="stop-color: var(--well-color-edge, hsl(var(--primary))); stop-opacity: 0.05" />
        </radialGradient>
      </defs>

      <!-- Grid Lines -->
      {#each points as point, i}
        <g>
          {#if i % (Math.ceil(width/20) + 1) !== 0 && i > 0}
            <line
              x1={points[i-1].x}
              y1={points[i-1].y}
              x2={point.x}
              y2={point.y}
              stroke="var(--grid-color, hsl(var(--muted-foreground) / 0.1))"
              stroke-width="1"
            />
          {/if}
          {#if i >= Math.ceil(width/20) + 1}
            <line
              x1={points[i-(Math.ceil(width/20) + 1)].x}
              y1={points[i-(Math.ceil(width/20) + 1)].y}
              x2={point.x}
              y2={point.y}
              stroke="var(--grid-color, hsl(var(--muted-foreground) / 0.1))"
              stroke-width="1"
            />
          {/if}
        </g>
      {/each}
      
      <!-- Well Center -->
      <circle
        cx={width/2}
        cy={height/2}
        r={80 * $wellSteepness}
        fill="url(#wellGradient)"
      />
    </svg>
  </div>
</div>