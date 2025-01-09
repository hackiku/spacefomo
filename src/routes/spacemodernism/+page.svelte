<!-- routes/spacemodernism -->
<script lang="ts">
</script>

<div class="relative py-16 bg-zinc-950 text-white">
  <div class="container relative max-w-6xl mx-auto px-4">
    <!-- Subtle grid overlay -->
    <div class="absolute inset-0 opacity-5">
      <div class="grid grid-cols-12 h-full gap-4">
        {#each Array(12) as _}
          <div class="border-r border-white/10" />
        {/each}
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Main Content -->
      <div class="col-span-12 lg:col-span-7">
        <h1 class="mb-8">
          <span class="block text-5xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
            Space intelligence,
          </span>
          <span class="block text-7xl font-medium tracking-tight mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            distilled.
          </span>
        </h1>

        <div class="max-w-md">
          <form class="flex gap-3 mb-6">
            <input 
              type="email" 
              placeholder="email@domain.com" 
              class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                     text-white placeholder-white/30 focus:outline-none focus:border-white/20"
            />
            <button 
              class="px-6 py-3 bg-white text-zinc-900 rounded-lg font-medium 
                     hover:bg-white/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          <p class="text-sm text-white/60 font-light">
            Weekly curated space industry intelligence. Concise. Essential.
          </p>
        </div>
      </div>

      <!-- Metrics -->
      <div class="col-span-12 lg:col-span-5">
        <div class="relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl blur-xl" />
          <div class="relative bg-white/5 border border-white/10 rounded-xl p-8">
            <div class="text-8xl font-light text-white/90">86</div>
            <div class="mt-2 text-sm font-medium uppercase tracking-wider text-white/40">
              Signal Score™
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>