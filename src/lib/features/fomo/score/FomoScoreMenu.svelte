<!-- src/lib/features/fomo/score/FomoScoreMenu.svelte -->
<script lang="ts">
  import { Gauge } from 'phosphor-svelte';
  
  // Props
  let { 
    isOpen = false,
    score = 44,
    articleCount = 24,
    threshold = 50,
    onThresholdChange
  } = $props<{
    isOpen: boolean;
    score?: number;
    articleCount?: number;
    threshold?: number;
    onThresholdChange?: (value: number) => void;
  }>();
  
  // Handle threshold change
  function handleThresholdChange(e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value);
    if (onThresholdChange) onThresholdChange(value);
  }
</script>

{#if isOpen}
  <div 
    class="absolute bottom-full left-0 mb-2 p-4 w-64
          bg-background rounded-2xl shadow-lg
          animate-in slide-in-from-top-2 duration-200 z-20"
  >
    <h3 class="text-base font-medium text-foreground mb-3">FOMO Score</h3>
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <Gauge class="h-5 w-5 text-primary" />
        <div>
          <div class="text-sm font-medium text-foreground">Current Score: {score}</div>
          <div class="text-xs text-muted-foreground">Based on {articleCount} articles</div>
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