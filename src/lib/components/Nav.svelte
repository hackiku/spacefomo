<!-- src/lib/components/Nav.svelte -->
<script lang="ts">
  import ModeToggle from "$lib/components/ui/ModeToggle.svelte";
  import { Rocket } from 'lucide-svelte';
  let isMenuOpen = false;
</script>

<nav class="sticky top-0 z-50 backdrop-blur-md border-b border-zinc-800/50">
  <div class="absolute inset-0 bg-zinc-900/80" />
  
  <!-- Subtle gradient line -->
  <div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
  
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
    <div class="flex justify-between items-center h-full">
      <!-- Logo Section -->
      <a href="/" class="group flex items-center space-x-3">
        <div class="relative">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
            <Rocket class="w-5 h-5 text-zinc-100 transform -rotate-45" />
          </div>
          <!-- Glow effect -->
          <div class="absolute inset-0 bg-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div class="flex flex-col">
          <span class="text-zinc-100 font-medium tracking-wide text-sm">Space FOMO</span>
          <span class="text-blue-400/60 text-xs tracking-widest font-mono">BETA</span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <a 
          href="/about" 
          class="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors duration-200"
        >
          About
        </a>
        <a 
          href="/news" 
          class="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors duration-200"
        >
          News
        </a>
        <button 
          class="px-4 py-2 text-sm font-medium rounded-md
                 bg-gradient-to-r from-blue-500/10 to-purple-500/10
                 hover:from-blue-500/20 hover:to-purple-500/20
                 border border-blue-500/20 hover:border-blue-500/40
                 text-zinc-100 transition-all duration-200
                 shadow-[0_0_15px_rgba(59,130,246,0.1)]
                 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
        >
          Submit Link
        </button>
        <ModeToggle />
      </div>

      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden text-zinc-400 hover:text-zinc-100"
        on:click={() => isMenuOpen = !isMenuOpen}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if isMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div class="relative md:hidden border-t border-zinc-800/50 backdrop-blur-md">
      <div class="bg-zinc-900/90 px-4 py-4">
        <div class="flex flex-col space-y-4">
          <a 
            href="/about" 
            class="text-zinc-400 hover:text-zinc-100 text-sm font-medium"
          >
            About
          </a>
          <a 
            href="/news" 
            class="text-zinc-400 hover:text-zinc-100 text-sm font-medium"
          >
            News
          </a>
          <button 
            class="text-left px-4 py-2 text-sm font-medium rounded-md
                   bg-gradient-to-r from-blue-500/10 to-purple-500/10
                   text-zinc-100"
          >
            Submit Link
          </button>
        </div>
      </div>
    </div>
  {/if}
</nav>