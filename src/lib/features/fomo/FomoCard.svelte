<!-- src/lib/features/fomo/FomoCard.svelte -->
<script lang="ts">
  import { CaretDown } from 'phosphor-svelte';
  import { slide } from 'svelte/transition';

  let { 
    weekNumber,
    dateRange,
    score,
    emoji,
    summary,
    isExpanded = false,
    isSelected = false,
    onClick = () => {}
  } = $props<{
    weekNumber: number;
    dateRange: string;
    score: number;
    emoji: string;
    summary: string;
    isExpanded?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
  }>();
</script>

<button
  type="button"
  class="w-full text-left transition-all duration-200 group rounded-2xl bg-zinc-800/80 
         border p-3 relative hover:opacity-100
         {isSelected ? 'border-violet-500/50' : 'border-zinc-700/80'}
         {!isSelected ? 'opacity-60' : ''}"
  on:click={onClick}
>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-xl font-medium bg-clip-text text-transparent 
                   bg-gradient-to-br from-violet-400 to-fuchsia-500">
        {score}
      </span>
      <span class="text-lg" aria-hidden="true">{emoji}</span>
    </div>
    
    <div class="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-transform duration-200"
         class:rotate-180={isExpanded}>
      <CaretDown />
    </div>
  </div>

  {#if isExpanded}
    <div class="mt-4 space-y-3" transition:slide={{ duration: 150 }}>
      <div class="flex justify-between text-sm text-zinc-400">
        <span>Week {weekNumber} FOMO</span>
        <span>{dateRange}</span>
      </div>
      <p class="text-zinc-300">{summary}</p>
    </div>
  {/if}
</button>