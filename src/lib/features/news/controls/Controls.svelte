<script lang="ts">
  import { Stack, Rows, SquaresFour, Table } from 'phosphor-svelte';
  import type { LayoutOption } from '$lib/types/layout';

  const layouts: LayoutOption[] = [
    { 
      name: 'compact',
      label: 'Compact',
      icon: Stack,
      config: {
        columns: 1,
        padding: 'compact',
        width: 'narrow'
      }
    },
    {
      name: 'normal',
      label: 'Normal',
      icon: Rows,
      config: {
        columns: 1,
        padding: 'normal',
        width: 'normal'
      }
    },
    {
      name: 'grid',
      label: 'Grid',
      icon: SquaresFour,
      config: {
        columns: 2,
        padding: 'normal',
        width: 'wide'
      }
    },
    {
      name: 'wide',
      label: 'Wide',
      icon: Table,
      config: {
        columns: 2,
        padding: 'wide',
        width: 'wide'
      }
    }
  ];

  let { activeLayout = $bindable('normal') } = $props<{
    activeLayout: LayoutOption['name']
  }>();
</script>

<div class="grid grid-cols-4 gap-2">
  {#each layouts as layout}
    {@const active = layout.name === activeLayout}
    <button
      class="group flex flex-col items-center gap-2 p-2 rounded-xl border
             transition-all duration-200
             {active 
               ? 'bg-zinc-800/80 border-zinc-700' 
               : 'border-zinc-800 hover:bg-zinc-800/50'}"
      on:click={() => activeLayout = layout.name}
    >
      <svelte:component 
        this={layout.icon}
        weight="light"
        class="w-5 h-5 transition-colors
              {active 
                ? 'text-violet-400' 
                : 'text-zinc-500 group-hover:text-zinc-400'}"
      />
      <span class="text-xs text-zinc-500">{layout.label}</span>
    </button>
  {/each}
</div>