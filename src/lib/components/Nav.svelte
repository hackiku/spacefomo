<!-- $lib/components/Nav.svelte -->

<script lang="ts">
  import ModeToggle from "$lib/components/ui/ModeToggle.svelte";
  let isMenuOpen = false;
</script>

<nav class="bg-[#2C2C2C] border-b border-[#CC0000]/20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
    <div class="flex justify-between items-center h-full">
      <!-- Logo Section -->
      <a href="/" class="flex items-center space-x-3 group">
        <div class="w-8 h-8 bg-[#CC0000] rounded-full flex items-center justify-center transform -rotate-12 transition-transform group-hover:rotate-0">
          <span class="text-[#F5E6D3] text-xl">🛰️</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[#F5E6D3] font-bold tracking-wider uppercase text-sm">Space FOMO</span>
          <span class="text-[#CC0000] text-xs tracking-widest">КОСМОС ФОМО</span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <a 
          href="/about" 
          class="text-[#F5E6D3] hover:text-[#CC0000] uppercase tracking-wide text-sm font-medium border-b border-transparent hover:border-[#CC0000] transition-colors duration-200"
        >
          About Mission
        </a>
        <a 
          href="/news" 
          class="text-[#F5E6D3] hover:text-[#CC0000] uppercase tracking-wide text-sm font-medium border-b border-transparent hover:border-[#CC0000] transition-colors duration-200"
        >
          Intelligence
        </a>
        <button 
          class="bg-[#CC0000] text-[#F5E6D3] px-4 py-2 text-sm uppercase tracking-wider hover:bg-[#A30000] transition-colors duration-200 font-bold transform -rotate-2 hover:rotate-0"
        >
          Submit Link
        </button>
        <ModeToggle />
      </div>

      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden text-[#F5E6D3] hover:text-[#CC0000]"
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
    <div class="md:hidden bg-[#2C2C2C] border-t border-[#CC0000]/20 px-4 py-4">
      <div class="flex flex-col space-y-4">
        <a 
          href="/about" 
          class="text-[#F5E6D3] hover:text-[#CC0000] uppercase tracking-wide text-sm font-medium"
        >
          About Mission
        </a>
        <a 
          href="/news" 
          class="text-[#F5E6D3] hover:text-[#CC0000] uppercase tracking-wide text-sm font-medium"
        >
          Intelligence
        </a>
        <button 
          class="bg-[#CC0000] text-[#F5E6D3] px-4 py-2 text-sm uppercase tracking-wider hover:bg-[#A30000] transition-colors duration-200 font-bold w-full text-left"
        >
          Submit Link
        </button>
      </div>
    </div>
  {/if}
</nav>
