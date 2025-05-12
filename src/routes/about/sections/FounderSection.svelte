<!-- src/routes/about/components/FounderSection.svelte -->
<script lang="ts">
  import { LinkedinLogo, GlobeHemisphereWest, Rocket, CodeSimple } from 'phosphor-svelte';
</script>

<div class="max-w-3xl mx-auto">
  <div class="text-center mb-12">
    <h2 class="text-3xl font-light mb-4 text-foreground">Meet the Founder</h2>
    <p class="text-muted-foreground text-lg max-w-xl mx-auto">
      SpaceFomo is an independent project built with passion for space exploration.
    </p>
  </div>
  
  <div class="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
    <!-- Profile Image -->
    <div class="w-40 h-40 relative">
      <div class="absolute inset-1 bg-space-gradient blur-md opacity-50 rounded-md"></div>
      <div class="absolute inset-0 border border-primary/20 rounded-md"></div>
      <div class="absolute inset-3 bg-card border border-border rounded-md overflow-hidden">
        <img src="/api/placeholder/136/136" alt="Ivan" class="h-full w-full object-cover" />
      </div>
    </div>
    
    <!-- Bio Content -->
    <div class="flex-1">
      <h3 class="text-xl font-medium text-foreground mb-3">Ivan</h3>
      <p class="text-muted-foreground leading-relaxed mb-4">
        Indie founder & product designer with a background in copywriting and UX. Since my first day of 
        flight school, I've been obsessed with aerospace interfaces, wing design, and orbital mechanics.
      </p>
      
      <!-- Projects -->
      <div class="space-y-3 mb-6">
        <a 
          href="https://pipewriter.io" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center gap-2 group text-muted-foreground hover:text-primary transition-colors"
        >
          <CodeSimple weight="bold" class="h-4 w-4 text-primary" />
          <span class="border-b border-transparent group-hover:border-primary/30">Pipewriter — UX app for writers</span>
        </a>
        
        <a 
          href="https://wingy.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center gap-2 group text-muted-foreground hover:text-primary transition-colors"
        >
          <GlobeHemisphereWest weight="bold" class="h-4 w-4 text-primary" />
          <span class="border-b border-transparent group-hover:border-primary/30">Wingy — Wing design explorations</span>
        </a>
        
        <div class="flex items-center gap-2 group text-muted-foreground">
          <Rocket weight="bold" class="h-4 w-4 text-primary" />
          <span>New project coming soon...</span>
        </div>
      </div>
      
      <!-- Contact -->
      <div class="flex items-center gap-4">
        <a 
          href="mailto:ivan@spacefomo.com" 
          class="group relative flex items-center gap-2 px-3 py-2 text-sm
                 border border-border bg-card/60 text-muted-foreground
                 hover:text-foreground transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/10
                 hover:before:translate-x-0 hover:before:translate-y-0
                 cursor-pointer"
        >
          <span>ivan@spacefomo.com</span>
        </a>
        
        <a 
          href="https://linkedin.com/in/ivankaraman" 
          target="_blank" 
          rel="noopener noreferrer"
          class="group relative flex items-center justify-center h-10 w-10
                 bg-muted border border-border text-muted-foreground
                 hover:text-foreground transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/10
                 hover:before:translate-x-0 hover:before:translate-y-0
                 cursor-pointer"
        >
          <LinkedinLogo weight="bold" class="h-5 w-5" />
        </a>
      </div>
    </div>
  </div>
  
  <!-- Teaser -->
  <div class="mt-12 text-center">
    <p class="text-sm text-muted-foreground italic">
      P.S. If you're curious about what's next, there might be a deep space ISRU 3D simulator on the horizon...
    </p>
  </div>
</div>