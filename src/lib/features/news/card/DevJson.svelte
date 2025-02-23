<!-- src/lib/features/news/card/DevJson.svelte -->
<script lang="ts">
  import { X } from 'phosphor-svelte';

  let { data, onClose } = $props<{
    data: Record<string, any>;
    onClose: () => void;
  }>();
</script>

<div class="w-96 rounded-2xl bg-zinc-900/95 backdrop-blur-sm border border-zinc-800">
  <div class="flex items-center justify-between p-4 border-b border-zinc-800">
    <h3 class="text-sm font-medium text-zinc-300">Raw Data</h3>
    <button
      type="button"
      class="rounded-lg p-1 hover:bg-zinc-800 transition-colors"
      onclick={onClose}
		  aria-label="Close JSON view"
    >
      <X class="h-4 w-4 text-zinc-500" />
    </button>
  </div>
  
  <div class="p-4 overflow-auto max-h-[80vh]">
    <pre class="text-xs text-zinc-400 whitespace-pre-wrap font-mono">{JSON.stringify(data, null, 2)}</pre>
  </div>
</div>