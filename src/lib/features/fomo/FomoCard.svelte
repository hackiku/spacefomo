<!-- src/lib/features/fomo/FomoCard.svelte -->
<script lang="ts">
  import { CaretDown } from 'phosphor-svelte';
  import { slide } from 'svelte/transition';

  let { 
    weekNumber,
    dateRange,
    score,
    summary,
    isExpanded = false,
    onClick = () => {}
  } = $props<{
    weekNumber: number;
    dateRange: string;
    score: number;
    summary: string;
    isExpanded?: boolean;
    onClick?: () => void;
  }>();

  const baseClasses = "w-full text-left transition-all duration-200 group rounded-2xl bg-zinc-800/80 border border-zinc-700/80 p-3 relative hover:bg-zinc-800/90";
  const caretClasses = "w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-transform duration-200";
  const scoreClasses = "text-xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-fuchsia-500";
</script>

<button
  type="button"
  class={baseClasses}
  onclick={onClick}
>
  <div class="flex items-center justify-between">
    <span class={scoreClasses}>
      {score}
    </span>
    
    <div class={caretClasses} class:rotate-180={isExpanded}>
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