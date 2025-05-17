<!-- src/routes/admin/misc/ApiMonitor.svelte -->
<script lang="ts">
  import { ArrowClockwise, CurrencyDollar, Gauge, Robot, Lightning, ChartLine, CalendarCheck } from 'phosphor-svelte';
  
  // Mock API provider data
  const apiProviders = [
    { 
      name: 'Claude', 
      status: 'operational', 
      latency: '254ms',
      usage: { current: 142, limit: 500, percent: 28.4 },
      cost: { today: 5.87, thisMonth: 89.42 },
      color: 'emerald'
    },
    { 
      name: 'GPT-4o', 
      status: 'operational', 
      latency: '320ms',
      usage: { current: 98, limit: 200, percent: 49 },
      cost: { today: 7.23, thisMonth: 124.56 },
      color: 'sky'
    },
    { 
      name: 'Perplexity', 
      status: 'degraded', 
      latency: '510ms',
      usage: { current: 53, limit: 150, percent: 35.3 },
      cost: { today: 2.85, thisMonth: 45.60 },
      color: 'amber'
    }
  ];
  
  // Usage stats by date
  const usageByDate = [
    { date: '2025-05-01', calls: 87, cost: 5.64 },
    { date: '2025-05-02', calls: 92, cost: 6.12 },
    { date: '2025-05-03', calls: 76, cost: 4.98 },
    { date: '2025-05-04', calls: 68, cost: 4.32 },
    { date: '2025-05-05', calls: 110, cost: 7.54 },
    { date: '2025-05-06', calls: 142, cost: 9.80 },
    { date: '2025-05-07', calls: 127, cost: 8.64 }
  ];
  
  // Mock refreshing
  let isRefreshing = $state(false);
  
  function refreshData() {
    isRefreshing = true;
    setTimeout(() => {
      isRefreshing = false;
    }, 1000);
  }
  
  // Format number with commas
  function formatNumber(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Generate bar heights for the chart
  function getBarHeight(calls: number) {
    const max = Math.max(...usageByDate.map(d => d.calls));
    return `${(calls / max) * 100}%`;
  }
  
  // Get status color
  function getStatusColor(status: string) {
    switch (status) {
      case 'operational': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-zinc-500';
    }
  }
  
  // Get status text
  function getStatusText(status: string) {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded';
      case 'down': return 'Down';
      default: return status;
    }
  }
</script>

<div class="space-y-6">
  <!-- Overview Card -->
  <div class="rounded-default border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
    <div class="p-5 border-b border-border flex items-center justify-between">
      <div>
        <h2 class="text-lg font-medium text-foreground">API Monitoring</h2>
        <p class="text-sm text-muted-foreground mt-1">
          Track usage, costs, and performance
        </p>
      </div>
      
      <button
        onclick={refreshData}
        class={`p-2 rounded-lg ${isRefreshing ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'} 
               transition-colors`}
        aria-label="Refresh data"
      >
        <ArrowClockwise weight="bold" class={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
    
    <!-- Summary Stats -->
    <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Monthly Cost -->
      <div class="rounded-lg border border-border bg-card/40 p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="h-9 w-9 rounded-full bg-violet-500/20 flex items-center justify-center">
            <CurrencyDollar weight="bold" class="h-5 w-5 text-violet-400" />
          </div>
          <span class="font-medium text-foreground">Monthly Cost</span>
        </div>
        
        <div class="text-3xl font-medium text-foreground mb-1">
          ${(apiProviders.reduce((acc, p) => acc + p.cost.thisMonth, 0)).toFixed(2)}
        </div>
        
        <div class="text-sm text-muted-foreground">
          ${(apiProviders.reduce((acc, p) => acc + p.cost.today, 0)).toFixed(2)} today
        </div>
      </div>
      
      <!-- API Calls -->
      <div class="rounded-lg border border-border bg-card/40 p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="h-9 w-9 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Lightning weight="bold" class="h-5 w-5 text-blue-400" />
          </div>
          <span class="font-medium text-foreground">Total API Calls</span>
        </div>
        
        <div class="text-3xl font-medium text-foreground mb-1">
          {formatNumber(usageByDate.reduce((acc, d) => acc + d.calls, 0))}
        </div>
        
        <div class="text-sm text-muted-foreground">
          {formatNumber(usageByDate[usageByDate.length - 1].calls)} today
        </div>
      </div>
      
      <!-- Average Latency -->
      <div class="rounded-lg border border-border bg-card/40 p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Gauge weight="bold" class="h-5 w-5 text-emerald-400" />
          </div>
          <span class="font-medium text-foreground">Average Latency</span>
        </div>
        
        <div class="text-3xl font-medium text-foreground mb-1">
          {Math.round(apiProviders.reduce((acc, p) => acc + parseInt(p.latency), 0) / apiProviders.length)}ms
        </div>
        
        <div class="text-sm text-muted-foreground">
          Across all providers
        </div>
      </div>
    </div>
    
    <!-- Usage Chart -->
    <div class="px-5 pb-5">
      <div class="rounded-lg border border-border bg-card/40 p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <ChartLine weight="duotone" class="h-5 w-5 text-muted-foreground" />
            <h3 class="font-medium text-foreground">Weekly Usage Trend</h3>
          </div>
          
          <div class="text-sm text-muted-foreground">
            Last 7 days
          </div>
        </div>
        
        <!-- Simple Bar Chart -->
        <div class="flex items-end h-32 gap-1 mt-6 mb-2">
          {#each usageByDate as day}
            <div class="flex-1 flex flex-col items-center gap-1">
              <div class="text-xs text-muted-foreground opacity-50">${day.cost.toFixed(2)}</div>
              <div 
                class="w-full bg-primary/60 hover:bg-primary transition-colors rounded-t-sm" 
                style={`height: ${getBarHeight(day.calls)}`}
                title={`${day.date}: ${day.calls} calls ($${day.cost.toFixed(2)})`}
              ></div>
            </div>
          {/each}
        </div>
        
        <!-- X-axis labels -->
        <div class="flex justify-between text-xs text-muted-foreground mt-1">
          {#each usageByDate as day}
            <div>{day.date.slice(-2)}</div>
          {/each}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Providers Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    {#each apiProviders as provider}
      <div class="rounded-default border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
        <div class="p-4 border-b border-border flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Robot weight="duotone" class="h-6 w-6 text-{provider.color}-400" />
            <h3 class="font-medium text-foreground">{provider.name}</h3>
          </div>
          
          <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs bg-black/20">
            <span class={`h-2 w-2 rounded-full ${getStatusColor(provider.status)}`}></span>
            <span class="text-muted-foreground">{getStatusText(provider.status)}</span>
          </div>
        </div>
        
        <div class="p-4 space-y-4">
          <!-- Usage bar -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-muted-foreground">Usage</span>
              <span class="text-foreground">{provider.usage.current}/{provider.usage.limit}</span>
            </div>
            <div class="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                class={`h-full bg-${provider.color}-500 rounded-full`}
                style={`width: ${provider.usage.percent}%`}
              ></div>
            </div>
          </div>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-3 pt-2">
            <!-- Latency -->
            <div class="rounded-lg bg-black/10 p-3">
              <div class="text-xs text-muted-foreground mb-1">Avg. Latency</div>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-medium text-foreground">{provider.latency}</span>
              </div>
            </div>
            
            <!-- Cost -->
            <div class="rounded-lg bg-black/10 p-3">
              <div class="text-xs text-muted-foreground mb-1">Today's Cost</div>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-medium text-foreground">${provider.cost.today.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>