<!-- src/lib/features/fomo/FomoCard.svelte -->
<script lang="ts">
  import { CaretDown, Rocket, Pulse, Star } from 'phosphor-svelte';
  import { slide } from 'svelte/transition';

  let { 
    weekNumber,
    dateRange,
    score,
    summary,
    stats,
    isExpanded = false,
    onClick = () => {}
  } = $props<{
    weekNumber: number;
    dateRange: string;
    score: number;
    summary: string;
    stats: {
      launchActivity: number;
      industryBuzz: number;
      techImpact: number;
    };
    isExpanded?: boolean;
    onClick?: () => void;
  }>();
</script>

<button
  type="button"
  class="w-full text-left transition-all duration-200 group rounded-2xl 
         bg-zinc-800/80 border border-zinc-700/80 overflow-hidden
         hover:bg-zinc-800/90 hover:border-zinc-700 focus:outline-none
         focus-visible:ring-2 focus-visible:ring-violet-500/40"
  onclick={onClick}
>
  <div class="p-4">
    <!-- Header with score and toggle -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-2xl font-medium bg-clip-text text-transparent 
                    bg-gradient-to-br from-violet-400 to-fuchsia-500">
          {score}
        </span>
        <span class="text-sm text-zinc-500">
          FOMO
        </span>
      </div>
      
      <div class="w-5 h-5 text-zinc-500 group-hover:text-zinc-400 
                  transition-transform duration-200"
           class:rotate-180={isExpanded}>
        <CaretDown />
      </div>
    </div>

    <!-- Always visible details -->
    <div class="flex justify-between mt-2 text-sm text-zinc-400">
      <span>Week {weekNumber}</span>
      <span>{dateRange}</span>
    </div>
  </div>
  
  <!-- Expanded content -->
  {#if isExpanded}
    <div transition:slide={{ duration: 150 }}>
      <!-- Separator -->
      <div class="h-px bg-zinc-800/80 mx-4"></div>
      
      <!-- Summary -->
      <div class="p-4 space-y-4">
        <p class="text-zinc-300 leading-relaxed">{summary}</p>
        
        <!-- Stats indicators -->
        <div class="grid grid-cols-3 gap-3 mt-4">
          <div class="space-y-1.5">
            <div class="flex items-center gap-1.5">
              <Rocket weight="light" class="w-4 h-4 text-emerald-400" />
              <span class="text-xs text-zinc-500">Launch</span>
            </div>
            <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500/70 rounded-full" 
                   style="width: {stats.launchActivity}%"></div>
            </div>
            <div class="text-right">
              <span class="text-xs text-emerald-400">{stats.launchActivity}</span>
            </div>
          </div>
          
          <div class="space-y-1.5">
            <div class="flex items-center gap-1.5">
              <Pulse weight="light" class="w-4 h-4 text-blue-400" />
              <span class="text-xs text-zinc-500">Buzz</span>
            </div>
            <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500/70 rounded-full" 
                   style="width: {stats.industryBuzz}%"></div>
            </div>
            <div class="text-right">
              <span class="text-xs text-blue-400">{stats.industryBuzz}</span>
            </div>
          </div>
          
          <div class="space-y-1.5">
            <div class="flex items-center gap-1.5">
              <Star weight="light" class="w-4 h-4 text-violet-400" />
              <span class="text-xs text-zinc-500">Tech</span>
            </div>
            <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-violet-500/70 rounded-full" 
                   style="width: {stats.techImpact}%"></div>
            </div>
            <div class="text-right">
              <span class="text-xs text-violet-400">{stats.techImpact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</button>