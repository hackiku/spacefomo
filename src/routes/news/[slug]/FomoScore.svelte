<!-- src/routes/news/[slug]/FomoScore.svelte -->
<script lang="ts">
  import { Gauge } from 'phosphor-svelte';
  
  let { score, impactScore } = $props<{
    score: number;
    impactScore?: number | null;
  }>();
  
  // Helper to get color based on score
  function getScoreColor(value: number) {
    if (value >= 90) return ['bg-venus-orange', 'bg-venus-yellow'];
    if (value >= 75) return ['bg-venus-yellow', 'bg-venus-orange'];
    if (value >= 60) return ['bg-venus-yellow', 'bg-venus-rust'];
    if (value >= 45) return ['bg-venus-orange', 'bg-venus-rust'];
    return ['bg-venus-rust', 'bg-venus-orange'];
  }
  
  // Helper to get text description based on score
  function getScoreText(value: number) {
    if (value >= 90) return 'Extreme';
    if (value >= 75) return 'High';
    if (value >= 60) return 'Significant';
    if (value >= 45) return 'Moderate';
    return 'Low';
  }
  
  const scoreColorClasses = $derived(getScoreColor(score));
  const scoreText = $derived(getScoreText(score));
</script>

<div class="rounded-default border border-border bg-card p-4 backdrop-blur-sm">
  <div class="mb-2 text-xs text-muted-foreground uppercase tracking-wider">FOMO Score</div>
  
  <div class="flex items-center gap-3">
    <div class="relative flex h-16 w-16 flex-shrink-0 items-center justify-center">
      <!-- Circle background -->
      <div class="absolute inset-0 rounded-full bg-muted"></div>
      
      <!-- Score progress ring -->
      <svg class="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none" 
          stroke="rgba(255, 255, 255, 0.1)"
          stroke-width="8"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray={`${2 * Math.PI * 40}`}
          stroke-dashoffset={`${2 * Math.PI * 40 * (1 - score/100)}`}
          class="transition-all duration-1000 ease-out"
          style="transform: rotate(-90deg); transform-origin: center; stroke: url(#fomoGradient);"
        />
        <defs>
          <linearGradient id="fomoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--venus-yellow)" />
            <stop offset="100%" stop-color="var(--venus-orange)" />
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Score text -->
      <div class="relative fomo-score text-xl font-bold">{score}</div>
    </div>
    
    <div class="flex-1">
      <div class="text-base font-medium text-foreground">{scoreText}</div>
      <div class="text-xs text-muted-foreground">Fear of missing out</div>
      
      {#if impactScore}
        <div class="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>Impact:</span>
          <span class="font-medium text-foreground">{impactScore}</span>
        </div>
      {/if}
    </div>
  </div>
</div>