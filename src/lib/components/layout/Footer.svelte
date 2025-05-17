<!-- src/lib/components/layout/Footer.svelte -->
<script lang="ts">
  import { GithubLogo, LinkedinLogo, Envelope, XLogo, TiktokLogo, InstagramLogo, ArrowRight, RocketLaunch } from 'phosphor-svelte';
  import { Button } from 'bits-ui';
  import EmailForm from '$lib/components/cta/email/EmailForm.svelte';
  import SpacefomoLogo from '$lib/components/ui/SpacefomoLogo.svelte';
  
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-background/80 backdrop-blur-sm border-t border-border/30 mt-16">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Main Footer Content -->
    <div class="py-12 md:py-16">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-12">
        <!-- Brand Column -->
        <div class="md:col-span-4 lg:col-span-5">
          <div class="flex items-center mb-4">
            <SpacefomoLogo size="md"/>
          </div>
          <p class="text-muted-foreground max-w-sm mb-6">
            SpaceFomo delivers concise, high-signal space industry news in ~100 words per story, helping you track what matters without the noise.
          </p>
          
          <!-- Quick Stats -->
          <div class="flex items-center gap-6 mt-8">
            <div class="flex flex-col">
              <span class="text-2xl font-semibold text-primary">67</span>
              <span class="text-xs text-muted-foreground">FOMO Score</span>
            </div>
            
            <div class="w-px h-10 bg-border/50"></div>
            
            <div class="flex flex-col">
              <span class="text-2xl font-semibold text-foreground">
                <RocketLaunch weight="fill" class="inline-block h-6 w-6 text-primary/70" /> 24
              </span>
              <span class="text-xs text-muted-foreground">Launches Tracked</span>
            </div>
          </div>
        </div>
        
        <!-- Navigation Columns -->
        <div class="md:col-span-8 lg:col-span-7">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <!-- Resources Column -->
            <div>
              <h3 class="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Resources</h3>
              <ul class="space-y-3">
                <li>
                  <a href="/news" class="text-muted-foreground hover:text-primary transition-colors">News</a>
                </li>
                <li>
                  <a href="/api/v1/news" class="text-muted-foreground hover:text-primary transition-colors">API Docs</a>
                </li>
                <li>
                  <a href="/weekly" class="text-muted-foreground hover:text-primary transition-colors">Weekly Digest</a>
                </li>
              </ul>
            </div>
            
            <!-- Company Column -->
            <div>
              <h3 class="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Company</h3>
              <ul class="space-y-3">
                <li>
                  <a href="/about" class="text-muted-foreground hover:text-primary transition-colors">About</a>
                </li>
                <li>
                  <a href="/terms" class="text-muted-foreground hover:text-primary transition-colors">Terms</a>
                </li>
                <li>
                  <a href="/privacy" class="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
                </li>
                <li>
                  <a href="/contact" class="text-muted-foreground hover:text-primary transition-colors">Contact</a>
                </li>
              </ul>
            </div>
            
            <!-- Connect Column -->
            <div>
              <h3 class="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Connect</h3>
              <div class="grid grid-cols-3 gap-2 sm:grid-cols-2 md:grid-cols-3">
                <a href="https://x.com/getspacefomo" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center h-10 w-10 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                   aria-label="Twitter/X">
                  <XLogo class="h-5 w-5" />
                </a>
                
                <a href="https://instagram.com/spacefomo" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center h-10 w-10 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                   aria-label="Instagram">
                  <InstagramLogo class="h-5 w-5" />
                </a>
                
                <a href="https://tiktok.com/@getspacefomo" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center h-10 w-10 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                   aria-label="TikTok">
                  <TiktokLogo class="h-5 w-5" />
                </a>
                
                <a href="https://linkedin.com/company/spacefomo" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center h-10 w-10 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                   aria-label="LinkedIn">
                  <LinkedinLogo class="h-5 w-5" />
                </a>
                
                <a href="https://github.com/spacefomo" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center h-10 w-10 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                   aria-label="GitHub">
                  <GithubLogo class="h-5 w-5" />
                </a>
                
                <a href="mailto:ivan@spacefomo.com" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center h-10 w-10 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                   aria-label="Email us">
                  <Envelope class="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Newsletter Section with Background -->
    <div class="py-8 px-6 md:py-12 md:px-10 bg-muted/30 border border-border/30 rounded-xl -mb-8 relative">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl pointer-events-none"></div>
      
      <div class="relative grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
        <div>
          <h3 class="text-2xl font-semibold text-foreground mb-2">Eyes to the Sky</h3>
          <p class="text-muted-foreground max-w-md">
            Get the latest space news, summarized and ranked by importance. Weekly emails, no spam.
          </p>
        </div>
        
        <div class="w-full max-w-md mx-auto md:ml-auto md:mr-0">
          <EmailForm />
        </div>
      </div>
    </div>
    
    <!-- Bottom Footer -->
    <div class="border-t border-border/20 py-6 mt-16">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p class="text-muted-foreground ">
          &copy; {currentYear} SpaceFomo. All rights reserved.
        </p>
        
        <div class="flex items-center space-x-6">
          <a href="/terms" class="text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="/privacy" class="text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="/cookies" class="text-muted-foreground hover:text-foreground transition-colors">
            Cookies
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>