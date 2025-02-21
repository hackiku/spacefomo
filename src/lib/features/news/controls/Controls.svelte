<!-- src/lib/features/news/controls/Controls.svelte -->
<script lang="ts">
  import { Stack, Rows, SquaresFour, Table } from 'phosphor-svelte';

  const layouts = [
    { icon: Stack, label: 'Compact' },
    { icon: Rows, label: 'Normal' },
    { icon: SquaresFour, label: 'Grid' },
    { icon: Table, label: 'Wide' }
  ];

  let activeLayout = $state('Normal');
</script>

<div class="space-y-4">
  <div class="grid grid-cols-4 gap-2">
    {#each layouts as layout}
      {@const active = layout.label === activeLayout}
      <button
        class="group flex flex-col items-center gap-2 p-2 rounded-xl border
               transition-all duration-200
               {active 
                 ? 'bg-zinc-800/80 border-zinc-700' 
                 : 'border-zinc-800 hover:bg-zinc-800/50'}"
        on:click={() => activeLayout = layout.label}
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
</div>