<!-- src/lib/components/admin/misc/ApiConsole.svelte -->
<script lang="ts">
  import { Code, X, CopySimple, CaretUp, CaretDown } from 'phosphor-svelte';
  import { cn } from '$lib/utils';
  import { useApiConsole } from '$lib/context/apiConsoleContext.svelte';
  
  // Get API console context
  const apiConsole = useApiConsole();
</script>

<!-- Button to toggle console -->
<button
  class="fixed top-4 right-4 z-50 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all"
  onclick={apiConsole.toggleConsole}
  aria-label="Toggle API Console"
>
  <Code weight="bold" class="h-5 w-5" />
</button>

<!-- API console panel -->
{#if apiConsole.isOpen}
  <div class="fixed top-16 right-4 z-50 w-[500px] bg-card border border-border rounded-lg shadow-xl overflow-hidden transition-all">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
      <div class="flex items-center gap-2">
        <Code weight="duotone" class="h-5 w-5 text-primary" />
        <h3 class="font-medium text-foreground">API Console</h3>
        {#if apiConsole.logs.length > 0}
          <span class="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
            {apiConsole.logs.length}
          </span>
        {/if}
      </div>
      
      <div class="flex items-center gap-2">
        <button
          onclick={apiConsole.toggleExpanded}
          class="p-1 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          {#if apiConsole.isExpanded}
            <CaretDown weight="bold" class="h-4 w-4" />
          {:else}
            <CaretUp weight="bold" class="h-4 w-4" />
          {/if}
        </button>
        
        <button
          onclick={apiConsole.clearLogs}
          class="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
        >
          <X weight="bold" class="h-4 w-4" />
        </button>
      </div>
    </div>
    
    {#if apiConsole.isExpanded}
      <!-- Log list -->
      {#if apiConsole.logs.length === 0}
        <div class="p-6 text-center text-muted-foreground">
          <p>No API calls logged yet.</p>
          <p class="text-xs mt-1">API calls will appear here as they happen.</p>
        </div>
      {:else}
        <div class="flex h-[400px]">
          <!-- Sidebar with log list -->
          <div class="w-1/3 border-r border-border overflow-y-auto bg-muted/30">
            {#each apiConsole.logs as log, index}
              <button
                class={cn(
                  "w-full text-left px-3 py-2 border-b border-border/50 hover:bg-muted transition-colors",
                  apiConsole.selectedLogIndex === index ? "bg-primary/5 border-l-2 border-l-primary" : ""
                )}
                onclick={() => apiConsole.selectLog(index)}
              >
                <div class="text-xs font-medium truncate">{log.function}</div>
                <div class="text-xs text-muted-foreground truncate">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div class={cn(
                  "text-xs mt-1 px-1.5 py-0.5 rounded-full inline-block",
                  log.success 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "bg-red-500/10 text-red-400"
                )}>
                  {log.success ? 'Success' : 'Error'}
                </div>
              </button>
            {/each}
          </div>
          
          <!-- Details panel -->
          <div class="w-2/3 overflow-y-auto">
            {#if apiConsole.logs[apiConsole.selectedLogIndex]}
              {@const log = apiConsole.logs[apiConsole.selectedLogIndex]}
              <div class="p-4">
                <!-- Function info -->
                <div class="mb-4">
                  <h4 class="text-sm font-medium text-foreground">{log.function}</h4>
                  <div class="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
                
                <!-- Request payload -->
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-1">
                    <h5 class="text-xs font-medium text-muted-foreground">Request Payload</h5>
                    <button
                      onclick={() => apiConsole.copyToClipboard(apiConsole.formatJson(log.payload))}
                      class="p-1 rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <CopySimple weight="bold" class="h-3 w-3" />
                    </button>
                  </div>
                  <pre class="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                    {apiConsole.formatJson(log.payload)}
                  </pre>
                </div>
                
                <!-- Response data -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <h5 class="text-xs font-medium text-muted-foreground">Response</h5>
                    <button
                      onclick={() => apiConsole.copyToClipboard(apiConsole.formatJson(log.response))}
                      class="p-1 rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <CopySimple weight="bold" class="h-3 w-3" />
                    </button>
                  </div>
                  <pre class="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                    {apiConsole.formatJson(log.response)}
                  </pre>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    {/if}
  </div>
{/if}