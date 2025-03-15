<!-- src/lib/features/sidebar/controls/Controls.svelte -->
<script lang="ts">
  import { ArrowsInLineHorizontal, Table, Rows, Columns, SquaresFour } from 'phosphor-svelte';
  import type { LayoutOption } from '$lib/types/layout';

  let { activeLayout = $bindable('normal'), columnCount = $bindable(2) } = $props<{
    activeLayout?: LayoutOption['name'];
    columnCount?: number;
  }>();

  // Width layout options
  const widthLayouts = [
    { name: 'compact', label: 'Compact', icon: ArrowsInLineHorizontal },
    { name: 'normal', label: 'Medium', icon: Columns },
    { name: 'wide', label: 'Wide', icon: Table }
  ] as const;

  // Column layout options
  const columnLayouts = [
    { name: 1, label: 'Single', icon: Rows },
    { name: 2, label: 'Grid', icon: SquaresFour }
  ] as const;
</script>

<div class="space-y-6">
  <!-- Width controls -->
  <div class="space-y-2">
    <p class="text-xs text-zinc-500">Content width</p>
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
          aria-label={layout.label}
          aria-pressed={active}
        >
          <svelte:component 
            this={layout.icon}
            weight={active ? 'regular' : 'light'}
            class="w-5 h-5 transition-colors
                  {active ? 'text-violet-400' : ''}"
          />
          <span class="sr-only">{layout.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Column layout controls -->
  <div class="space-y-2">
    <p class="text-xs text-zinc-500">Column layout</p>
    <div class="flex gap-2">
      {#each columnLayouts as layout}
        {@const active = columnCount === layout.name}
        <button
          type="button"
          class="group flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg border
                 transition-all duration-200 text-xs
                 {active 
                   ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200' 
                   : 'border-zinc-800 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
          onclick={() => columnCount = layout.name}
          aria-label={layout.label}
          aria-pressed={active}
        >
          <svelte:component 
            this={layout.icon}
            weight={active ? 'regular' : 'light'}
            class="w-5 h-5 transition-colors
                  {active ? 'text-violet-400' : ''}"
          />
          <span class="sr-only">{layout.label}</span>
        </button>
      {/each}
    </div>
  </div>
</div>