<!-- src/lib/features/fomo/WeeklyFomo.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
</script>

<div class="relative group">
  <!-- Glow effect - different opacity for dark/light -->
  <div class="absolute -inset-4 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
              dark:bg-violet-500/20 dark:group-hover:opacity-75
              light:bg-violet-500/10 light:group-hover:opacity-50" />
  
  <div class="flex md:flex-col relative overflow-hidden rounded-2xl border
              dark:bg-black/30 dark:backdrop-blur-sm dark:border-white/10
              bg-gray-200/30 backdrop-blur-sm border-black/10
              p-8">
    <div class="text-center">
      <!-- Score with gradient -->
      <div class="text-8xl font-bold bg-clip-text text-transparent
                  dark:bg-gradient-to-br dark:from-violet-400 dark:to-fuchsia-500
                  light:bg-gradient-to-br light:from-violet-600 light:to-fuchsia-600
                  mb-2">
        {$fomoStore.currentScore}
      </div>
      
      <!-- Label -->
      <div class="text-sm font-medium uppercase tracking-wider
                  dark:text-zinc-400 light:text-zinc-600">
        FOMO Level
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-6 space-y-4">
      {#each ['Launch Activity', 'Industry Buzz', 'Tech Impact'] as stat}
        <div class="flex items-center gap-2">
          <div class="h-1 flex-1 rounded-full overflow-hidden
                      dark:bg-zinc-800 light:bg-zinc-200">
            <div class="h-full w-[85%] rounded-full
                        dark:bg-gradient-to-r dark:from-violet-500 dark:to-fuchsia-500
                        light:bg-gradient-to-r light:from-violet-600 light:to-fuchsia-600" />
          </div>
          <span class="text-xs dark:text-zinc-500 light:text-zinc-600">{stat}</span>
        </div>
      {/each}
    </div>
  </div>
</div>