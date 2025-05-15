<!-- src/lib/features/fomo/score/FomoScoreButton.svelte -->
<script lang="ts">
  import { FireSimple } from 'phosphor-svelte';
  
  // Props
  let { 
    score = 44,
    onClick
  } = $props<{
    score?: number;
    onClick: () => void;
  }>();
</script>

<button
  type="button"
  class="flex items-center gap-1.5 cursor-pointer"
  onclick={onClick}
  aria-label="Toggle FOMO score menu"
>
  <FireSimple weight="bold" class="w-5 h-5 text-primary" />
  <span class="text-sm font-medium text-foreground">
    <span class="ml-1 text-lg font-semibold text-primary">{score}</span>
  </span>
</button>