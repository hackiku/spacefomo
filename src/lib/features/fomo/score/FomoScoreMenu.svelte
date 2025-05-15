<!-- src/lib/features/fomo/score/FomoScoreMenu.svelte -->
<script lang="ts">
  import { Gauge, CheckCircle } from 'phosphor-svelte';
  
  // Props
  let { 
    isOpen = false,
    score = 0,
    articleCount = 0,
    threshold = 50,
    onThresholdChange
  } = $props<{
    isOpen: boolean;
    score?: number;
    articleCount?: number;
    threshold?: number;
    onThresholdChange?: (value: number) => void;
  }>();
  
  // Convert to simple numbers
  const scoreNumber = Number(score) || 0;
  const countNumber = Number(articleCount) || 0;
  
  // Local state for the slider - initialize with the incoming threshold
  let sliderValue = $state(threshold);
  
  // Update local slider value when prop changes
  $effect(() => {
    sliderValue = threshold;
  });
  
  // Handle slider input (just updates local state, doesn't commit)
  function handleSliderInput(e: Event) {
    sliderValue = parseInt((e.target as HTMLInputElement).value);
  }
  
  // Apply the threshold change
  function applyThreshold() {
    if (onThresholdChange && sliderValue !== threshold) {
      onThresholdChange(sliderValue);
      console.log('Threshold applied:', sliderValue);
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
          <div class="text-sm font-medium text-foreground">Current Score: {scoreNumber}</div>
          <div class="text-xs text-muted-foreground">Based on {countNumber} articles</div>
        </div>
      </div>
      
      <!-- FOMO threshold slider -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-muted-foreground font-medium">Threshold</p>
          <div class="fomo-score text-sm">{sliderValue}</div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={sliderValue}
          oninput={handleSliderInput}
          class="w-full appearance-none bg-muted h-2 accent-primary"
        />
        
        <!-- Apply button -->
        <div class="flex justify-end mt-3">
          <button
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
            onclick={applyThreshold}
            disabled={sliderValue === threshold}
          >
            <CheckCircle class="h-3.5 w-3.5" />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}