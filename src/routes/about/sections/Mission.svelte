<!-- src/routes/about/sections/Mission.svelte -->
<script lang="ts">
  import { Rocket, Broadcast, Timer } from 'phosphor-svelte';
</script>

<div class="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
  <!-- Mission Graphic -->
  <div class="relative order-2 md:order-1">
    <div class="aspect-square max-w-sm mx-auto relative">
      <!-- Outer Ring -->
      <div class="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full animate-spin-slow"></div>
      
      <!-- Inner Circles -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-card border border-border rounded-full"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary/10 rounded-full"></div>
      
      <!-- Orbiting Icons -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-card border border-border rounded-full">
        <Rocket weight="fill" class="h-6 w-6 text-primary" />
      </div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-3 bg-card border border-border rounded-full">
        <Broadcast weight="fill" class="h-6 w-6 text-primary" />
      </div>
      <div class="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-card border border-border rounded-full">
        <Timer weight="fill" class="h-6 w-6 text-primary" />
      </div>
      
      <!-- Center Icon -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-space-gradient rounded-full">
        <svg class="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>
  
  <!-- Mission Text -->
  <div class="order-1 md:order-2">
    <h2 class="text-3xl font-light mb-6 text-foreground">Our Mission</h2>
    
    <div class="space-y-6 text-muted-foreground leading-relaxed">
      <p>
        Space exploration is accelerating at a breathtaking pace, but keeping up with industry developments 
        can be overwhelming. SpaceFomo was built to solve this problem by creating a more 
        accessible window into the cosmos.
      </p>
      
      <p>
        We leverage AI to distill complex space news into concise, digestible summaries, then add our 
        proprietary FOMO score that measures how important each development is to the future of space exploration.
      </p>
      
      <p>
        Our goal is simple: help busy space enthusiasts, industry professionals, and curious minds stay informed 
        about what matters most in space, without getting lost in the noise.
      </p>
    </div>
  </div>
</div>

<style>
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin-slow {
    animation: spin-slow 30s linear infinite;
  }
</style>