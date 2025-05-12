<!-- src/routes/about/components/Hero.svelte -->
<script lang="ts">
  import { ArrowDown } from 'phosphor-svelte';
</script>

<div class="relative py-20 md:py-32 overflow-hidden">
  <!-- Background Elements -->
  <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
    <div class="w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl opacity-50"></div>
  </div>
  
  <!-- Content -->
  <div class="container mx-auto relative z-10">
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-5xl md:text-6xl font-light mb-6 text-foreground">
        Welcome to SpaceFomo
      </h1>
      
      <p class="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
        Your window to the cosmos. Space news ~100 words a pop, with AI-powered insights and FOMO scores.
      </p>
      
      <div class="inline-flex items-center gap-2 text-primary border-b border-primary/30 pb-1">
        <span class="text-lg">Explore our mission</span>
        <ArrowDown weight="bold" class="h-4 w-4 animate-bounce" />
      </div>
    </div>
  </div>
  
  <!-- Decorative Element -->
  <div class="absolute left-1/2 bottom-12 -translate-x-1/2 hidden md:block">
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="29" stroke="url(#grad)" stroke-width="2"/>
      <path d="M30 15 L30 45 M20 35 L30 45 L40 35" stroke="url(#grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stop-color="var(--venus-yellow)"/>
          <stop offset="1" stop-color="var(--venus-orange)"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
</div>