<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { Github, Twitter } from 'lucide-svelte';
  const year = new Date().getFullYear();
</script>

<footer class="relative mt-auto border-t border-zinc-800/50">
  <!-- Gradient mesh background -->
  <div class="absolute inset-0">
    <div class="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-900/90" />
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
  </div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
      <!-- Branding -->
      <div class="space-y-4">
        <h3 class="text-xl font-medium text-zinc-100">
          Space FOMO
        </h3>
        <p class="text-zinc-400 text-sm">
          Tracking space developments since {year}
          <br/>
          <span class="font-mono text-blue-400/60">v0.1.0 beta</span>
        </p>
      </div>
      
      <!-- Links -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-zinc-100">Navigation</h4>
        <div class="space-y-3 text-sm text-zinc-400">
          <a href="/about" class="block hover:text-zinc-100 transition-colors duration-200">
            About
          </a>
          <a href="/news" class="block hover:text-zinc-100 transition-colors duration-200">
            News Feed
          </a>
          <a href="/submit" class="block hover:text-zinc-100 transition-colors duration-200">
            Submit Link
          </a>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-zinc-100">Stay Updated</h4>
        <p class="text-sm text-zinc-400">
          Get the weekly space digest delivered to your inbox.
        </p>
        <div class="flex space-x-4">
          <a 
            href="https://twitter.com/spacefomo" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10
                   hover:from-blue-500/20 hover:to-purple-500/20
                   border border-blue-500/20 hover:border-blue-500/40
                   transition-all duration-200"
          >
            <Twitter class="w-5 h-5 text-zinc-100" />
          </a>
          <a 
            href="https://github.com/spacefomo" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10
                   hover:from-blue-500/20 hover:to-purple-500/20
                   border border-blue-500/20 hover:border-blue-500/40
                   transition-all duration-200"
          >
            <Github class="w-5 h-5 text-zinc-100" />
          </a>
        </div>
      </div>
    </div>
    
    <!-- Bottom bar -->
    <div class="mt-12 pt-8 border-t border-zinc-800/50">
      <div class="text-center text-sm text-zinc-400">
        Built with <span class="text-blue-400/60">♥</span> for the space community
      </div>
    </div>
  </div>
</footer>