<!-- src/lib/features/news/card/DevJson.svelte -->
<script lang="ts">
  import { X, Copy } from 'phosphor-svelte';

  let { data, onClose } = $props<{
    data: Record<string, any>;
    onClose: () => void;
  }>();
  
  let jsonCopied = $state(false);
  
  function copyJson() {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString);
    jsonCopied = true;
    setTimeout(() => {
      jsonCopied = false;
    }, 2000);
  }
</script>

<div class="w-96 rounded-2xl bg-zinc-900/95 backdrop-blur-sm border border-zinc-800">
  <div class="flex items-center justify-between p-4 border-b border-zinc-800">
    <h3 class="text-sm font-medium text-zinc-300">Raw Data</h3>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-lg p-1.5 hover:bg-zinc-800 transition-colors flex items-center gap-1"
        onclick={copyJson}
        aria-label="Copy JSON data"
      >
        <Copy class="h-4 w-4 text-zinc-500" />
        {#if jsonCopied}
          <span class="text-xs text-emerald-400">Copied</span>
        {/if}
      </button>
      
      <button
        type="button"
        class="rounded-lg p-1 hover:bg-zinc-800 transition-colors"
        onclick={onClose}
        aria-label="Close JSON view"
      >
        <X class="h-4 w-4 text-zinc-500" />
      </button>
    </div>
  </div>
  
  <div class="p-4 overflow-auto max-h-[80vh]">
    <pre class="text-xs text-zinc-400 whitespace-pre-wrap font-mono">{JSON.stringify(data, null, 2)}</pre>
  </div>
</div>