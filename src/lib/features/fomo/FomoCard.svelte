<!-- src/lib/features/fomo/FomoCard.svelte -->
<script lang="ts">
  import { CaretDown, CaretUp } from 'phosphor-svelte';

  let { 
    weekNumber,
    dateRange,
    score,
    emoji,
    summary,
    isExpanded = false,
    isActive = false,
    onClick = () => {},
    onToggle = () => {}
  } = $props<{
    weekNumber: number;
    dateRange: string;
    score: number;
    emoji: string;
    summary: string;
    isExpanded?: boolean;
    isActive?: boolean;
    onClick?: () => void;
    onToggle?: () => void;
  }>();
</script>

<div
  class="w-full text-left transition-all duration-200 group"
  class:opacity-60={!isActive}
  class:hover:opacity-100={!isActive}
  on:click={onClick}
>
  <div class="rounded-2xl bg-zinc-800/80 border border-zinc-700/80 
              {isExpanded ? 'p-6' : 'p-3'} relative">
    
    <!-- Always visible content -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xl font-medium bg-clip-text text-transparent 
                     bg-gradient-to-br from-violet-400 to-fuchsia-500">
          {score}
        </span>
        <span class="text-lg">{emoji}</span>
      </div>
      
      <button 
        class="rounded-lg p-1 hover:bg-zinc-700/50 transition-colors"
        on:click|stopPropagation={onToggle}
      >
        <svelte:component 
          this={isExpanded ? CaretUp : CaretDown } 
          class="w-4 h-4 text-zinc-500 group-hover:text-zinc-400"
        />
      </button>
    </div>

    <!-- Expanded content -->
    {#if isExpanded}
      <div class="mt-4 space-y-3">
        <div class="flex justify-between text-sm text-zinc-400">
          <span>Week {weekNumber} FOMO</span>
          <span>{dateRange}</span>
        </div>
        <p class="text-zinc-300">{summary}</p>
      </div>
    {/if}
  </div>
</div>