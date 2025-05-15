<!-- src/lib/features/fomo/score/FomoScoreMenu.svelte -->
<script lang="ts">
  import { Gauge } from 'phosphor-svelte';
  
  // Props
  let { 
    isOpen = false,
    score = 0,
    articleCount = 0,
    threshold = 20, // Match the lower initial threshold from fomoContext
    onThresholdChange
  } = $props<{
    isOpen: boolean;
    score?: number;
    articleCount?: number;
    threshold?: number;
    onThresholdChange?: (value: number) => void;
  }>();
  
  // Format values to ensure clean display
  const displayScore = $derived(() => {
    if (typeof score === 'function') {
      console.warn('Score is a function in FomoScoreMenu, using 0 instead');
      return 0;
    }
    return typeof score === 'number' ? Math.round(score) : 0;
  });
  
  const displayCount = $derived(() => {
    if (typeof articleCount === 'function') {
      console.warn('ArticleCount is a function in FomoScoreMenu, using 0 instead');
      return 0;
    }
    return typeof articleCount === 'number' ? articleCount : 0;
  });
  
  // Handle threshold change
  function handleThresholdChange(e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value);
    if (onThresholdChange) {
      onThresholdChange(value);
      console.log('Threshold changed to:', value);
    }
  }
</script>

{#if isOpen}
  <div 
    class="absolute bottom-full left-0 mb-2 p-4 w-64
          bg-background rounded-t-2xl
          animate-in slide-in-from-bottom-2 duration-800 z-20"
  >
    <h3 class="text-base font-medium text-foreground mb-3">FOMO Score</h3>
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <Gauge class="h-5 w-5 text-primary" />
        <div>
          <div class="text-sm font-medium text-foreground">Current Score: {displayScore}</div>
          <div class="text-xs text-muted-foreground">Based on {displayCount} articles</div>
        </div>
      </div>
      
      <!-- FOMO threshold slider -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-muted-foreground font-medium">Threshold</p>
          <div class="fomo-score text-sm">{threshold}</div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={threshold}
          onchange={handleThresholdChange}
          oninput={handleThresholdChange}
          class="w-full appearance-none bg-muted h-2 accent-primary"
        />
      </div>
    </div>
  </div>
{/if}