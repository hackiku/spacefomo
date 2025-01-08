<!-- src/lib/components/GravityWell.svelte -->
<script lang="ts">
  import { fomoStore, wellSteepness } from '$lib/stores/fomoStore';

  // Path generation helpers
  function generateWellPath(steepness: number) {
    const width = 200;
    const height = 200;
    const centerX = width / 2;
    const centerY = height / 2;
    const depth = steepness * 150; // Max depth of 150px
    
    // Create a spiral-like curve that gets tighter based on steepness
    const spiral = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = (1 - i / 8) * width / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const z = (i / 8) * depth;
      return `${x},${y},${z}`;
    });

    return spiral.join(' L ');
  }
</script>

<div class="relative w-full h-full">
  <svg 
    viewBox="0 0 200 200" 
    class="w-full h-full"
  >
    <!-- Gradient definitions -->
    <defs>
      <radialGradient id="wellGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color: rgb(0,0,0); stop-opacity: 0.8" />
        <stop offset="100%" style="stop-color: rgb(30,30,30); stop-opacity: 0.2" />
      </radialGradient>
      
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Base well shape -->
    <path 
      d={`M ${generateWellPath($wellSteepness)}`}
      fill="url(#wellGradient)"
      stroke="rgba(255,255,255,0.1)"
      stroke-width="0.5"
      filter="url(#glow)"
    />

    <!-- Particles floating around the well -->
    {#each Array(20) as _, i}
      <circle 
        cx={100 + Math.cos(i/5 * Math.PI * 2) * (30 + i*2)} 
        cy={100 + Math.sin(i/5 * Math.PI * 2) * (30 + i*2)}
        r="0.5"
        fill="white"
        opacity={0.5 - i/40}
      >
        <animate 
          attributeName="opacity"
          values="0.5;0.2;0.5"
          dur={`${2 + i/2}s`}
          repeatCount="indefinite"
        />
      </circle>
    {/each}
  </svg>

  <!-- Score display -->
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="text-center">
      <span class="block text-5xl font-bold">{$fomoStore.currentScore}</span>
      <span class="text-sm opacity-60">FOMO LEVEL</span>
    </div>
  </div>
</div>