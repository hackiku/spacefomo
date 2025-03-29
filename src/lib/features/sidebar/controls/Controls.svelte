<!-- src/lib/features/sidebar/controls/Controls.svelte -->
<script lang="ts">
  import { ArrowsInLineHorizontal, Columns, Table, Rows, SquaresFour, ArrowsOutCardinal } from 'phosphor-svelte';
  import type { SidebarMode, CardWidth, ColumnCount } from '$lib/types/layout';

  let { 
    sidebarMode = $bindable<SidebarMode>('default'),
    cardWidth = $bindable<CardWidth>('normal'),
    columnCount = $bindable<ColumnCount>(1)
  } = $props();

  // Sidebar mode options
  const sidebarOptions = [
    { value: 'thin', label: 'Thin sidebar', icon: ArrowsInLineHorizontal },
    { value: 'default', label: 'Default layout', icon: Columns },
    { value: 'wide', label: 'Wide layout', icon: Table }
  ] as const;

  // Card width options
  const cardOptions = [
    { value: 'normal', label: 'Normal width', icon: Columns },
    { value: 'wide', label: 'Wide cards', icon: ArrowsOutCardinal }
  ] as const;

  // Column options
  const columnOptions = [
    { value: 1, label: 'Single column', icon: Rows },
    { value: 2, label: 'Two columns', icon: SquaresFour }
  ] as const;
</script>

<div class="space-y-6">
  <!-- Sidebar layout controls -->
  <div class="space-y-2">
    <p class="text-xs text-zinc-500">Layout</p>
    <div class="flex gap-2">
      {#each sidebarOptions as option}
        {@const active = option.value === sidebarMode}
        <button
          type="button"
          class="group flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg border
                 transition-all duration-200 text-xs
                 {active 
                   ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200' 
                   : 'border-zinc-800 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
          onclick={() => sidebarMode = option.value}
          aria-label={option.label}
          aria-pressed={active}
        >
          <svelte:component 
            this={option.icon}
            weight={active ? 'regular' : 'light'}
            class="w-5 h-5 transition-colors
                  {active ? 'text-violet-400' : ''}"
          />
          <span class="sr-only">{option.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Card width controls -->
  <div class="space-y-2">
    <p class="text-xs text-zinc-500">Card width</p>
    <div class="flex gap-2">
      {#each cardOptions as option}
        {@const active = option.value === cardWidth}
        <button
          type="button"
          class="group flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg border
                 transition-all duration-200 text-xs
                 {active 
                   ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200' 
                   : 'border-zinc-800 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
          onclick={() => cardWidth = option.value}
          aria-label={option.label}
          aria-pressed={active}
        >
          <svelte:component 
            this={option.icon}
            weight={active ? 'regular' : 'light'}
            class="w-5 h-5 transition-colors
                  {active ? 'text-violet-400' : ''}"
          />
          <span class="sr-only">{option.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Column layout controls -->
  <div class="space-y-2">
    <p class="text-xs text-zinc-500">Columns</p>
    <div class="flex gap-2">
      {#each columnOptions as option}
        {@const active = option.value === columnCount}
        <button
          type="button"
          class="group flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg border
                 transition-all duration-200 text-xs
                 {active 
                   ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200' 
                   : 'border-zinc-800 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
          onclick={() => columnCount = option.value}
          aria-label={option.label}
          aria-pressed={active}
        >
          <svelte:component 
            this={option.icon}
            weight={active ? 'regular' : 'light'}
            class="w-5 h-5 transition-colors
                  {active ? 'text-violet-400' : ''}"
          />
          <span class="sr-only">{option.label}</span>
        </button>
      {/each}
    </div>
  </div>
</div>