<!-- src/lib/features/news/controls/Controls.svelte -->
<script lang="ts">
  // import { Rows, Table, Columns, SquaresFour } from 'phosphor-svelte';
  import { ArrowsInLineHorizontal, Table, Rows, Columns, SquaresFour } from 'phosphor-svelte';
  import type { LayoutOption } from '$lib/types/layout';

  let { activeLayout = $bindable('normal') } = $props<{
    activeLayout?: LayoutOption['name']
  }>();

  // Width controls
  const widthLayouts = [
    { name: 'compact', label: 'Compact', icon: ArrowsInLineHorizontal },
    { name: 'normal', label: 'Medium', icon: Columns },
    { name: 'wide', label: 'Wide', icon: Table }
  ];

  // Column controls - we'll integrate this with the grid system
  const columnLayouts = [
    { label: 'Single', icon: Rows },
    { label: 'Grid', icon: SquaresFour }
  ];

  let columnCount = $state(2);
</script>

<div class="space-y-3">
  <!-- Width controls -->
  <div class="flex gap-2">
    {#each widthLayouts as layout}
      {@const active = layout.name === activeLayout}
      <button
        type="button"
        class="group flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg border
               transition-all duration-200 text-xs
               {active 
                 ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200' 
                 : 'border-zinc-800 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
        onclick={() => activeLayout = layout.name}
      >
        <svelte:component 
          this={layout.icon}
          weight={active ? 'regular' : 'light'}
          class="w-5 h-5 transition-colors
                {active ? 'text-violet-400' : ''}"
        />
        <!-- <span>{layout.label}</span> -->
      </button>
    {/each}
  </div>

  <!-- Column layout controls -->
  <div class="flex gap-2">
    {#each columnLayouts as layout, i}
      {@const active = columnCount === (i + 1)}
      <button
        type="button"
        class="group flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg border
               transition-all duration-200 text-xs
               {active 
                 ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200' 
                 : 'border-zinc-800 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
        onclick={() => columnCount = i + 1}
      >
        <svelte:component 
          this={layout.icon}
          weight={active ? 'regular' : 'light'}
          class="w-5 h-5 transition-colors
                {active ? 'text-violet-400' : ''}"
        />
        <!-- <span>{layout.label}</span> -->
      </button>
    {/each}
  </div>
</div>