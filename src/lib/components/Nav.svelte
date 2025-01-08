<!-- src/lib/components/Nav.svelte -->
<script lang="ts">
  import ModeToggle from "$lib/components/ui/ModeToggle.svelte";
  import { Rocket } from 'lucide-svelte';
  let isMenuOpen = false;
</script>

<nav class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md md:px-20">
  <div class="container h-16">
    <div class="flex justify-between items-center h-full">
      <!-- Logo -->
      <a href="/" class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Rocket class="w-6 h-6 text-primary transform -rotate-45" />
        </div>
        <span class="text-lg font-medium">Space FOMO</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <a href="/about" class="text-muted-foreground hover:text-foreground text-lg transition-colors">
          About
        </a>
        <a href="/news" class="text-muted-foreground hover:text-foreground text-lg transition-colors">
          News
        </a>
        <ModeToggle />
      </div>

      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden p-2 text-muted-foreground hover:text-foreground"
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
    <div class="md:hidden border-t border-border bg-background">
      <div class="container py-4">
        <div class="flex flex-col gap-4">
          <a href="/about" class="text-muted-foreground hover:text-foreground text-lg">
            About
          </a>
          <a href="/news" class="text-muted-foreground hover:text-foreground text-lg">
            News
          </a>
        </div>
      </div>
    </div>
  {/if}
</nav>