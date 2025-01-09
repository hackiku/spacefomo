<div class="relative py-16 bg-indigo-950">
  <!-- Retro pattern background -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0);
    background-size: 32px 32px;" />
  </div>

  <div class="container relative max-w-6xl mx-auto px-4">
    <div class="grid grid-cols-12 gap-8">
      <!-- Main Content -->
      <div class="col-span-12 lg:col-span-7">
        <h1 class="mb-8">
          <span class="block text-6xl font-bold text-orange-400" style="font-family: 'Space Grotesk', sans-serif;">
            SPACE FOMO
          </span>
          <span class="block text-3xl font-medium text-orange-200/80 mt-2" style="font-family: 'Space Grotesk', sans-serif;">
            YOUR WEEKLY SPACE DIGEST
          </span>
        </h1>

        <div class="max-w-md">
          <div class="relative">
            <div class="absolute -inset-1 bg-orange-400/20 rounded-full blur-sm" />
            <form class="relative flex gap-3 mb-6">
              <input 
                type="email" 
                placeholder="Ground Control to..." 
                class="flex-1 px-6 py-4 bg-indigo-900/50 border-2 border-orange-300/30 rounded-full
                       text-orange-100 placeholder-orange-200/30 focus:outline-none focus:border-orange-400/50"
              />
              <button 
                class="px-8 py-4 bg-orange-400 text-indigo-950 rounded-full font-bold
                       hover:bg-orange-300 transition-colors"
              >
                Launch
              </button>
            </form>
          </div>
          
          <p class="text-lg text-orange-200/60 font-medium pl-6">
            100 words. Once a week. Zero gravity.
          </p>
        </div>
      </div>

      <!-- Metrics Display -->
      <div class="col-span-12 lg:col-span-5">
        <div class="relative w-48 h-48 mx-auto">
          <!-- Orbital rings -->
          <div class="absolute inset-0 rounded-full border-4 border-orange-400/20 animate-spin" 
               style="animation-duration: 20s;" />
          <div class="absolute inset-4 rounded-full border-4 border-orange-300/30 animate-spin" 
               style="animation-duration: 15s;" />
          
          <!-- Central metric -->
          <div class="absolute inset-8 rounded-full bg-orange-400/10 border-2 border-orange-400
                      flex items-center justify-center">
            <div class="text-center">
              <div class="text-6xl font-bold text-orange-400">86</div>
              <div class="text-xs uppercase tracking-widest text-orange-200/70 mt-1">
                Signal Level
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>