<!-- src/lib/features/fomo/score/FomoScoreButton.svelte -->
<script lang="ts">
  import { FireSimple } from 'phosphor-svelte';
  
  // Props
  let { 
    score = 0,
    onClick
  } = $props<{
    score?: number;
    onClick: () => void;
  }>();
  
  // Convert to a simple number to ensure display
  const scoreNumber = Number(score) || 0;
</script>

<button
  type="button"
  class="flex items-center gap-1.5 cursor-pointer"
  onclick={onClick}
  aria-label="Toggle FOMO score menu"
>
  <FireSimple weight="bold" class="w-5 h-5 text-primary" />
  <span class="text-sm font-medium text-foreground">
    <span class="ml-1 text-lg font-semibold text-primary">{scoreNumber}</span>
  </span>
</button>