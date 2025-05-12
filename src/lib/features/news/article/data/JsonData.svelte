<!-- src/lib/features/news/article/data/JsonData.svelte -->
<script lang="ts">
  import { X, Copy } from 'phosphor-svelte';
  import { Button } from "bits-ui";

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

<div class="w-full h-full flex flex-col">
  <div class="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
    <h3 class="text-sm font-medium text-foreground">Raw Data</h3>
    <div class="flex items-center gap-2">
      <Button.Root
        onclick={copyJson}
        class="group relative flex items-center gap-1 p-1.5
               text-muted-foreground hover:text-foreground transition-colors
               before:absolute before:inset-0
               before:border before:border-primary/0
               before:translate-x-0.5 before:translate-y-0.5
               before:transition-transform before:duration-300
               hover:before:border-primary/10
               hover:before:translate-x-0 hover:before:translate-y-0"
        aria-label="Copy JSON data"
      >
        <Copy class="h-4 w-4" />
        {#if jsonCopied}
          <span class="text-xs text-primary">Copied</span>
        {/if}
      </Button.Root>
      
      {#if onClose}
        <Button.Root
          onclick={onClose}
          class="group relative p-1.5 md:hidden
                text-muted-foreground hover:text-foreground transition-colors
                before:absolute before:inset-0
                before:border before:border-primary/0
                before:translate-x-0.5 before:translate-y-0.5
                before:transition-transform before:duration-300
                hover:before:border-primary/10
                hover:before:translate-x-0 hover:before:translate-y-0"
          aria-label="Close JSON view"
        >
          <X class="h-4 w-4" />
        </Button.Root>
      {/if}
    </div>
  </div>
  
  <div class="p-4 overflow-auto flex-1 bg-muted/20">
    <pre class="text-xs text-muted-foreground whitespace-pre-wrap font-mono">{JSON.stringify(data, null, 2)}</pre>
  </div>
</div>