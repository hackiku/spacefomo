<!-- src/lib/features/news/controls/Controls.svelte -->
<script lang="ts">
  import type { LayoutOption } from '$lib/types/layout';
  import { Stack } from 'phosphor-svelte';  // Using phosphor-svelte for now

  const layouts: LayoutOption[] = [
    { name: 'compact', label: 'Compact', icon: Stack },
    { name: 'normal', label: 'Normal', icon: Stack },
    { name: 'grid', label: 'Grid', icon: Stack },
    { name: 'wide', label: 'Wide', icon: Stack }
  ];

  let { activeLayout = $bindable('normal') } = $props<{
    activeLayout?: LayoutOption['name']
  }>();
</script>

<div class="grid grid-cols-4 gap-2">
  {#each layouts as layout}
    {@const active = layout.name === activeLayout}
    <button
      type="button"
      class="group flex flex-col items-center gap-2 p-2 rounded-xl border
             transition-all duration-200
             {active 
               ? 'bg-zinc-800/80 border-zinc-700' 
               : 'border-zinc-800 hover:bg-zinc-800/50'}"
      onclick={() => activeLayout = layout.name}
    >
      <Stack
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