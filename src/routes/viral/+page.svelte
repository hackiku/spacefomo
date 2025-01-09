<!-- src/routes/viral/+page.svelte -->
<script lang="ts">
  import { fly, scale } from 'svelte/transition';
  let activeReaders = 142;
  let fomoScore = 86;
</script>

<div class="min-h-screen bg-black text-white">
  <!-- Hero Section -->
  <div class="relative h-[100svh] flex items-center px-6">
    <!-- Animated background grid -->
    <div class="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(0,0,0,0.8)_50%),_linear-gradient(to_right,rgba(100,100,100,0.1)_1px,transparent_1px),_linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px)] bg-[size:100%_100%,24px_24px,24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

    <!-- Live activity indicator -->
    <div class="absolute top-8 left-6 flex items-center gap-2 text-sm">
      <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span class="text-zinc-400">
        <span class="font-medium text-emerald-500">{activeReaders}</span> reading now
      </span>
    </div>

    <!-- Main content -->
    <div class="container max-w-5xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left side -->
        <div class="space-y-8">
          <div class="space-y-4">
            <h1 class="text-5xl md:text-6xl font-bold">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                Space News for
              </span>
              <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                Busy Humans
              </span>
            </h1>
            <p class="text-lg text-zinc-400">
              Weekly space intel in 100-word shots. 
              Never miss the next big launch.
            </p>
          </div>

          <!-- Email signup with social proof -->
          <div class="space-y-6 max-w-md">
            <form class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200" />
              <div class="relative flex">
                <input 
                  type="email"
                  placeholder="you@email.com"
                  class="flex-1 px-4 py-3 bg-black/50 backdrop-blur-sm border border-white/10 
                         rounded-l-lg text-white placeholder-zinc-500 focus:outline-none 
                         focus:border-violet-500/50"
                />
                <button class="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium
                             rounded-r-lg transition-colors">
                  Join
                </button>
              </div>
            </form>
            
            <!-- Social proof -->
            <div class="flex items-center gap-4 text-sm text-zinc-500">
              <div class="flex -space-x-2">
                {#each Array(4) as _}
                  <div class="w-6 h-6 rounded-full border-2 border-black bg-zinc-800" />
                {/each}
              </div>
              <p>Join 1,248 space enthusiasts</p>
            </div>
          </div>
        </div>

        <!-- Right side - FOMO Score -->
        <div class="relative hidden lg:block">
          <div class="absolute -inset-4 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
          <div class="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <!-- Score display -->
            <div class="mb-6">
              <div class="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-fuchsia-500">
                {fomoScore}
              </div>
              <div class="text-sm font-medium uppercase tracking-wider text-zinc-400">
                FOMO Score
              </div>
            </div>
            
            <!-- Stats -->
            <div class="space-y-4">
              {#each ['Launch Activity', 'Industry Buzz', 'Tech Breakthroughs'] as stat}
                <div class="flex items-center gap-2">
                  <div class="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div class="h-full w-[85%] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                  </div>
                  <span class="text-xs text-zinc-500">{stat}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500">
      <span class="text-sm">Scroll for this week's hits</span>
      <div class="w-5 h-8 border-2 border-zinc-800 rounded-full flex items-start justify-center p-1">
        <div class="w-1 h-2 bg-zinc-700 rounded-full animate-bounce" />
      </div>
    </div>
  </div>

  <!-- Content Preview (partially visible) -->
  <div class="h-[30vh] bg-gradient-to-b from-black to-zinc-900 flex items-start justify-center pt-12">
    <div class="container max-w-5xl px-6">
      <div class="bg-zinc-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
        <!-- Content here -->
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
</style>