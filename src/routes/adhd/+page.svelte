<!-- src/routes/viralmode/+page.svelte -->
<script lang="ts">
  import { fly, scale } from 'svelte/transition';
  let email = '';
  let hasScrolled = false;
  let score = 86;
</script>

<div class="min-h-screen bg-black text-white overflow-hidden">
  <!-- Hero Section -->
  <div class="h-[100svh] snap-center flex flex-col justify-center relative px-4">
    <!-- Floating score -->
    <div 
      class="absolute top-8 right-4 z-10"
      in:fly={{ y: -100, duration: 1000 }}
    >
      <div class="relative">
        <div class="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse"></div>
        <div class="relative bg-black/50 backdrop-blur-sm border border-purple-500/50 rounded-3xl px-6 py-3">
          <div class="text-5xl font-black text-purple-400">{score}</div>
          <div class="text-xs font-bold uppercase tracking-widest text-purple-300/70">Fomo</div>
        </div>
      </div>
    </div>

    <!-- Main CTA -->
    <div class="space-y-6 max-w-md mx-auto w-full">
      <h1 
        class="text-4xl md:text-5xl font-black text-center leading-tight"
        in:fly={{ y: 50, duration: 800 }}
      >
        <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-500">
          Space News
        </span>
        <br />
        for people who
        <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
          can't read good
        </span>
      </h1>

      <!-- Email Input -->
      <div 
        class="relative group"
        in:fly={{ y: 50, duration: 800, delay: 200 }}
      >
        <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur transition group-hover:opacity-100 opacity-75 group-hover:blur-xl animate-tilt"></div>
        <form class="relative flex flex-col gap-2">
          <input
            type="email"
            bind:value={email}
            placeholder="drop ur email bestie"
            class="w-full px-6 py-4 bg-black/50 backdrop-blur-sm border border-purple-500/20 
                   rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50
                   transition-all"
          />
          <button 
            class="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold
                   text-white uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            get the tea ☕️
          </button>
        </form>
      </div>

      <!-- Value Prop -->
      <p 
        class="text-center text-white/60 text-lg"
        in:fly={{ y: 50, duration: 800, delay: 400 }}
      >
        100 words. no cap fr fr
      </p>
    </div>

    <!-- Scroll Indicator -->
    <div 
      class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      class:opacity-0={hasScrolled}
      transition:scale
    >
      <div class="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
        <div class="w-1 h-3 bg-white/20 rounded-full animate-scrollDown"></div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes scrollDown {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }

  @keyframes tilt {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }

  .animate-scrollDown {
    animation: scrollDown 1.5s infinite;
  }

  .animate-tilt {
    animation: tilt 10s infinite linear;
  }
</style>

<svelte:window 
  on:scroll={() => {
    if (window.scrollY > 10) hasScrolled = true;
  }}
/>