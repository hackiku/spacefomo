<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { GithubLogo, LinkedinLogo, Envelope, XLogo, TiktokLogo, InstagramLogo } from 'phosphor-svelte';
  import EmailForm from '$lib/components/cta/email/EmailForm.svelte';
  import SpacefomoLogo from '$lib/components/ui/SpacefomoLogo.svelte';
</script>

<footer class="border-t border-border bg-card/60 backdrop-blur-sm">
  <div class="container mx-auto py-12 px-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
      <!-- Logo and Description -->
      <div class="md:col-span-2">
        <div class="flex items-center mb-4">
          <SpacefomoLogo size="md"/>
        </div>
        <p class="text-muted-foreground text-sm mb-6">
          Can't-miss space news 100 words a pop
        </p>
      </div>
      
      <!-- Quick Links -->
      <div class="md:col-span-1">
        <ul class="space-y-2">
          <li>
            <a href="/" class="text-muted-foreground hover:text-foreground transition-colors">Home</a>
          </li>
          <li>
            <a href="/about" class="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </li>
        </ul>
      </div>
      
      <!-- Subscribe Section -->
      <div class="md:col-span-2">
        <h3 class="text-lg font-medium text-foreground mb-4">Stay in orbit</h3>
        <EmailForm />
      </div>
    </div>
    
    <!-- Social Media Links and Copyright -->
    <div class="pt-8 flex flex-col md:flex-row justify-between items-center">
      <div class="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
        <a 
          href="https://x.com/getspacefomo" 
          target="_blank" 
          rel="noopener noreferrer"
          class="group relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:scale-110
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/20
                 hover:before:translate-x-0 hover:before:translate-y-0"
          aria-label="Twitter/X"
        >
          <XLogo class="w-6 h-6" />
        </a>
        <a 
          href="https://instagram.com/spacefomo" 
          target="_blank" 
          rel="noopener noreferrer"
          class="group relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:scale-110
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/20
                 hover:before:translate-x-0 hover:before:translate-y-0"
          aria-label="Instagram"
        >
          <InstagramLogo class="w-6 h-6" />
        </a>
        <a 
          href="https://tiktok.com/@spacefomo" 
          target="_blank" 
          rel="noopener noreferrer"
          class="group relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:scale-110
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/20
                 hover:before:translate-x-0 hover:before:translate-y-0"
          aria-label="TikTok"
        >
          <TiktokLogo class="w-6 h-6" />
        </a>
        <a 
          href="https://linkedin.com/company/spacefomo" 
          target="_blank" 
          rel="noopener noreferrer"
          class="group relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:scale-110
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/20
                 hover:before:translate-x-0 hover:before:translate-y-0"
          aria-label="LinkedIn"
        >
          <LinkedinLogo class="w-6 h-6" />
        </a>
        <a 
          href="https://github.com/spacefomo" 
          target="_blank" 
          rel="noopener noreferrer"
          class="group relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:scale-110
                 before:absolute before:inset-0
                 before:border before:border-primary/0
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:border-primary/20
                 hover:before:translate-x-0 hover:before:translate-y-0"
          aria-label="GitHub"
        >
          <GithubLogo class="w-6 h-6" />
        </a>
      </div>
      
      <p class="text-muted-foreground text-sm">
        Copyalright © {new Date().getFullYear()} Spacefomo
      </p>
    </div>
  </div>
</footer>