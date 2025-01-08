<!-- src/lib/components/GravityWell.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fomoStore, wellSteepness, wellDepth, wellSize } from '$lib/stores/fomoStore';
  
  let container: HTMLDivElement;
  let width = 0;
  let height = 0;
  
  type GridCell = {
    x: number;
    y: number;
    z: number;
    opacity: number;
  };
  
  let cells: GridCell[][] = [];
  
  onMount(() => {
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });
    
    observer.observe(container);
    return () => observer.disconnect();
  });
  
  $: {
    if (width && height) {
      const gridSize = 20;
      const rows = Math.ceil(height / gridSize) + 4;
      const cols = Math.ceil(width / gridSize) + 4;
      const centerX = width / 2;
      const centerY = height / 2;
      
      cells = Array(rows).fill(0).map((_, rowIndex) => 
        Array(cols).fill(0).map((_, colIndex) => {
          const x = colIndex * gridSize - gridSize * 2;
          const y = rowIndex * gridSize - gridSize * 2;
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxRadius = Math.min(width, height) * $wellSize;
          const falloff = Math.max(0, 1 - distance / maxRadius);
          const distortion = falloff * $wellDepth;
          
          return {
            x: x + (dx / distance) * distortion * $wellSteepness || 0,
            y: y + (dy / distance) * distortion * $wellSteepness || 0,
            z: distortion,
            opacity: Math.min(0.15, distortion / 200)
          };
        })
      );
    }
  }
</script>

<div class="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-black to-blue-950">
  <div 
    class="relative w-full h-full"
    style="perspective: 1000px; transform-style: preserve-3d;"
    bind:this={container}
  >
    <div 
      class="absolute inset-0"
      style="transform: rotateX(60deg) translateZ(-100px); transform-style: preserve-3d;"
    >
      {#each cells as row, rowIndex}
        <div class="flex" style="transform-style: preserve-3d;">
          {#each row as cell, colIndex}
            <div
              class="border border-blue-500/20"
              style="
                width: 20px;
                height: 20px;
                transform: translate3d({cell.x}px, {cell.y}px, {cell.z}px);
                transition: transform 0.3s ease-out;
                background-color: rgba(59, 130, 246, {cell.opacity});
              "
            />
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  div {
    transform-style: preserve-3d;
  }
</style>