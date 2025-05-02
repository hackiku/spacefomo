<script lang="ts">
  import { ArrowsInLineHorizontal, Table, Rows, Columns, SquaresFour } from 'phosphor-svelte';
  import type { LayoutOption } from '$lib/types/layout';

  let { activeLayout = $bindable('normal') } = $props<{
    activeLayout?: LayoutOption['name']
  }>();

  const widthLayouts = [
    { name: 'compact', label: 'Compact', icon: ArrowsInLineHorizontal },
    { name: 'normal', label: 'Medium', icon: Columns },
    { name: 'wide', label: 'Wide', icon: Table }
  ];

  const columnLayouts = [
    { label: 'Single', icon: Rows },
    { label: 'Grid', icon: SquaresFour }
  ];

  let columnCount = $state(2);
</script>

<div class="space-y-3">
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
        {#if layout.icon === ArrowsInLineHorizontal}
          <ArrowsInLineHorizontal weight={active ? 'regular' : 'light'} class="w-5 h-5 transition-colors {active ? 'text-violet-400' : ''}" />
        {:else if layout.icon === Columns}
          <Columns weight={active ? 'regular' : 'light'} class="w-5 h-5 transition-colors {active ? 'text-violet-400' : ''}" />
        {:else}
          <Table weight={active ? 'regular' : 'light'} class="w-5 h-5 transition-colors {active ? 'text-violet-400' : ''}" />
        {/if}
        <span class="sr-only">{layout.label}</span>
      </button>
    {/each}
  </div>

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
        {#if layout.icon === Rows}
          <Rows weight={active ? 'regular' : 'light'} class="w-5 h-5 transition-colors {active ? 'text-violet-400' : ''}" />
        {:else}
          <SquaresFour weight={active ? 'regular' : 'light'} class="w-5 h-5 transition-colors {active ? 'text-violet-400' : ''}" />
        {/if}
        <span class="sr-only">{layout.label}</span>
      </button>
    {/each}
  </div>
</div>

