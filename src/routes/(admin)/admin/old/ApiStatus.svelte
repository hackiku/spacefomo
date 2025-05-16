<!-- src/routes/admin/ApiStatus.svelte -->
<script lang="ts">
  import { Info, Robot, Gauge, Clock, CurrencyDollar, Lightning } from 'phosphor-svelte';
  
  // Mock data for UI design
  const apiStatus = [
    { 
      name: 'Claude', 
      status: 'operational', 
      latency: '250ms',
      usage: { current: 120, limit: 500 },
      cost: { today: 4.25, thisMonth: 82.50 }
    },
    { 
      name: 'GPT-4o', 
      status: 'operational', 
      latency: '300ms',
      usage: { current: 80, limit: 200 },
      cost: { today: 5.75, thisMonth: 98.20 }
    },
    { 
      name: 'Cohere', 
      status: 'degraded', 
      latency: '520ms',
      usage: { current: 45, limit: 300 },
      cost: { today: 2.10, thisMonth: 42.35 }
    },
    { 
      name: 'Perplexity', 
      status: 'operational', 
      latency: '410ms',
      usage: { current: 15, limit: 100 },
      cost: { today: 1.25, thisMonth: 28.75 }
    }
  ];
</script>

<div class="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
  <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
    <h2 class="font-medium text-zinc-200">API Status</h2>
    
    <div class="text-xs text-zinc-500">
      Last updated: {new Date().toLocaleTimeString()}
    </div>
  </div>
  
  <div class="divide-y divide-zinc-800">
    {#each apiStatus as api}
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Robot weight="duotone" class="h-5 w-5 text-violet-400" />
            <h3 class="font-medium text-zinc-200">{api.name}</h3>
            
            {#if api.status === 'operational'}
              <span class="ml-2 flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operational
              </span>
            {:else if api.status === 'degraded'}
              <span class="ml-2 flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Degraded
              </span>
            {:else}
              <span class="ml-2 flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Down
              </span>
            {/if}
          </div>
          
          <div class="flex items-center gap-2 text-sm text-zinc-500">
            <div class="flex items-center gap-1">
              <Lightning weight="fill" class="h-3.5 w-3.5" />
              <span>{api.latency}</span>
            </div>
          </div>
        </div>
        
        <!-- Metrics -->
        <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <!-- Usage -->
          <div class="flex items-center gap-2">
            <Gauge weight="duotone" class="h-4 w-4 text-blue-400" />
            <span class="text-zinc-400">
              Usage: {api.usage.current}/{api.usage.limit}
            </span>
          </div>
          
          <!-- Cost -->
          <div class="flex items-center gap-2">
            <CurrencyDollar weight="duotone" class="h-4 w-4 text-emerald-400" />
            <span class="text-zinc-400">
              Today: ${api.cost.today.toFixed(2)}
            </span>
          </div>
          
          <!-- Progress Bar -->
          <div class="col-span-2 mt-1">
            <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full {api.status === 'operational' 
                  ? 'bg-emerald-500' 
                  : api.status === 'degraded' 
                    ? 'bg-amber-500' 
                    : 'bg-red-500'}"
                style="width: {(api.usage.current / api.usage.limit) * 100}%"
              ></div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <div class="p-4 border-t border-zinc-800 bg-zinc-800/30">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5 text-sm text-zinc-400">
        <Info weight="fill" class="h-4 w-4 text-zinc-500" />
        <span>Monthly spending: $251.80</span>
      </div>
      
      <button
        class="text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700
               text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        Refresh Status
      </button>
    </div>
  </div>
</div>