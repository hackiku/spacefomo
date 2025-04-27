<!-- src/lib/features/news/controls/LayoutControls.svelte -->
<script lang="ts">
  import { ArrowsInLineHorizontal, Columns, Table, Rows, SquaresFour } from 'phosphor-svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';

  let { 
    sidebarMode, columnCount, compact,
    onSidebarModeChange, onColumnCountChange
  } = $props<{
    sidebarMode: SidebarMode;
    columnCount: ColumnCount;
    compact: boolean;
    onSidebarModeChange: (mode: SidebarMode) => void;
    onColumnCountChange: (count: ColumnCount) => void;
  }>();

  // Sidebar mode options
  const sidebarOptions = [
    { value: 'thin', label: 'Compact view', icon: ArrowsInLineHorizontal },
    { value: 'default', label: 'Default layout', icon: Columns },
    { value: 'wide', label: 'Wide layout', icon: Table }
  ] as const;

  // Column options
  const columnOptions = [
    { value: 1, label: 'Single column', icon: Rows },
    { value: 2, label: 'Two columns', icon: SquaresFour }
  ] as const;
</script>

<div class="space-y-6 w-full">
  <!-- Sidebar layout controls -->
  <div class="space-y-2">
    {#if !compact}
      <p class="text-xs text-zinc-500">Layout</p>
    {/if}
    <div class="{compact ? 'flex flex-col gap-2' : 'flex gap-2'}">
      {#each sidebarOptions as option}
        {@const active = option.value === sidebarMode}
        <button
          type="button"
          class="w-10 h-10 flex items-center justify-center rounded-lg border
                 transition-all duration-200
                 {active 
                   ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200' 
                   : 'border-zinc-800 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
          onclick={() => onSidebarModeChange(option.value)}
          aria-label={option.label}
          aria-pressed={active}
        >
          <svelte:component 
            this={option.icon}
            weight={active ? 'regular' : 'light'}
            class="w-5 h-5 transition-colors {active ? 'text-violet-400' : ''}"
          />
        </button>
      {/each}
    </div>
  </div>

  <!-- Column layout controls -->
  <div class="space-y-2">
    {#if !compact}
      <p class="text-xs text-zinc-500">Columns</p>
    {/if}
    <div class="{compact ? 'flex flex-col gap-2' : 'flex gap-2'}">
      {#each columnOptions as option}
        {@const active = option.value === columnCount}
        <button
          type="button"
          class="w-10 h-10 flex items-center justify-center rounded-lg border
                 transition-all duration-200
                 {active 
                   ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200' 
                   : 'border-zinc-800 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
          onclick={() => onColumnCountChange(option.value)}
          aria-label={option.label}
          aria-pressed={active}
        >
          <svelte:component 
            this={option.icon}
            weight={active ? 'regular' : 'light'}
            class="w-5 h-5 transition-colors {active ? 'text-violet-400' : ''}"
          />
        </button>
      {/each}
    </div>
  </div>
</div>