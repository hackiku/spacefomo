<!-- $lib/components/Footer.svelte -->
<script lang="ts">
  const year = new Date().getFullYear();
</script>

<footer class="bg-[#2C2C2C] text-[#F5E6D3] py-12 mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Propaganda-style title -->
      <div class="space-y-4">
        <h3 class="font-bold text-xl tracking-[0.2em] uppercase transform -rotate-2 inline-block border-b-2 border-[#CC0000]">
          Space FOMO
        </h3>
        <p class="font-mono text-sm opacity-80">Collectively tracking space developments since {year}</p>
      </div>
      
      <!-- Links with Soviet-style decorative elements -->
      <div class="space-y-3">
        <h4 class="text-[#CC0000] font-bold mb-4 uppercase tracking-wide">Navigate</h4>
        <div class="space-y-2 font-mono text-sm">
          <a href="/about" class="block hover:text-[#CC0000] transition-colors duration-200">
            ★ About Mission
          </a>
          <a href="/news" class="block hover:text-[#CC0000] transition-colors duration-200">
            ★ Space News
          </a>
          <a href="/submit" class="block hover:text-[#CC0000] transition-colors duration-200">
            ★ Submit Link
          </a>
        </div>
      </div>

      <!-- Soviet-style call to action -->
      <div class="relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-[#CC0000] opacity-10 transform rotate-45" />
        <div class="relative">
          <h4 class="text-[#CC0000] font-bold uppercase tracking-wide mb-4">Join Movement</h4>
          <p class="font-mono text-sm mb-4">Stay informed, comrade! No space news shall escape our collective vigilance.</p>
          <button class="bg-[#CC0000] text-[#F5E6D3] px-6 py-2 text-sm uppercase tracking-wider hover:bg-[#A30000] transition-colors duration-200 font-bold transform -rotate-1">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  </div>
</footer>