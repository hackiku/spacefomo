<!-- src/lib/features/news/controls/Controls.svelte -->
<script lang="ts">
  import { SquaresFour, ArrowsOut, ArrowsIn } from 'phosphor-svelte';

  let { layout = {
    columns: 1,
    padding: 'normal',
    width: 'normal'
  }} = $props();

  // Layout control states using runes
  let columns = $state(1);
  let padding = $state('normal'); // 'compact' | 'normal' | 'wide'
  let width = $state('normal');   // 'narrow' | 'normal' | 'wide'

  $effect(() => {
    layout = {
      columns,
      padding,
      width
    };
  });
</script>

<div class="space-y-6">
  <!-- Control Section -->
  <div class="space-y-4">
    <!-- Column Layout -->
    <div class="space-y-2">
      <label class="text-sm text-zinc-500">Grid Columns</label>
      <div class="flex gap-2">
        <button
          class="flex-1 h-10 rounded-full border border-zinc-800 
                 hover:bg-zinc-800/50 transition-colors
                 flex items-center justify-center gap-2
                 {columns === 1 ? 'bg-zinc-800/50' : ''}"
          on:click={() => columns = 1}
        >
          <SquaresFour weight="light" class="w-4 h-4" />
          <span class="text-sm">Single</span>
        </button>
        <button
          class="flex-1 h-10 rounded-full border border-zinc-800 
                 hover:bg-zinc-800/50 transition-colors
                 flex items-center justify-center gap-2
                 {columns === 2 ? 'bg-zinc-800/50' : ''}"
          on:click={() => columns = 2}
        >
          <SquaresFour weight="light" class="w-4 h-4" />
          <span class="text-sm">Double</span>
        </button>
      </div>
    </div>

    <!-- Padding Control -->
    <div class="space-y-2">
      <label class="text-sm text-zinc-500">Padding</label>
      <div class="flex gap-2">
        <button
          class="flex-1 h-10 rounded-full border border-zinc-800 
                 hover:bg-zinc-800/50 transition-colors
                 {padding === 'compact' ? 'bg-zinc-800/50' : ''}"
          on:click={() => padding = 'compact'}
        >
          <span class="text-sm">Compact</span>
        </button>
        <button
          class="flex-1 h-10 rounded-full border border-zinc-800 
                 hover:bg-zinc-800/50 transition-colors
                 {padding === 'normal' ? 'bg-zinc-800/50' : ''}"
          on:click={() => padding = 'normal'}
        >
          <span class="text-sm">Normal</span>
        </button>
        <button
          class="flex-1 h-10 rounded-full border border-zinc-800 
                 hover:bg-zinc-800/50 transition-colors
                 {padding === 'wide' ? 'bg-zinc-800/50' : ''}"
          on:click={() => padding = 'wide'}
        >
          <span class="text-sm">Wide</span>
        </button>
      </div>
    </div>

    <!-- Width Control -->
    <div class="space-y-2">
      <label class="text-sm text-zinc-500">Feed Width</label>
      <div class="flex gap-2">
        <button
          class="flex-1 h-10 rounded-full border border-zinc-800 
                 hover:bg-zinc-800/50 transition-colors
                 flex items-center justify-center gap-2
                 {width === 'narrow' ? 'bg-zinc-800/50' : ''}"
          on:click={() => width = 'narrow'}
        >
          <ArrowsIn weight="light" class="w-4 h-4" />
          <span class="text-sm">Narrow</span>
        </button>
        <button
          class="flex-1 h-10 rounded-full border border-zinc-800 
                 hover:bg-zinc-800/50 transition-colors
                 flex items-center justify-center gap-2
                 {width === 'wide' ? 'bg-zinc-800/50' : ''}"
          on:click={() => width = 'wide'}
        >
          <ArrowsOut weight="light" class="w-4 h-4" />
          <span class="text-sm">Wide</span>
        </button>
      </div>
    </div>
  </div>
</div>