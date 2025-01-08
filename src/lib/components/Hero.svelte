<!-- $lib/components/Hero.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  let email = "";
  
  function handleSubmit() {
    // TODO: Implement email subscription
    console.log('Email submitted:', email);
  }
</script>

<section class="relative overflow-hidden">
  <!-- Decorative Elements -->
  <div class="absolute inset-0 overflow-hidden">
    <!-- Red Star -->
    <div class="absolute -top-4 right-1/4 w-24 h-24 bg-[#CC0000] opacity-20 transform rotate-45" />
    <!-- Beige Circle -->
    <div class="absolute top-1/2 -right-12 w-48 h-48 rounded-full bg-[#F5E6D3] opacity-5" />
    <!-- Red Lines -->
    <div class="absolute bottom-0 left-0 w-full h-1 bg-[#CC0000] opacity-10 transform -rotate-3" />
    <div class="absolute bottom-8 left-0 w-full h-1 bg-[#CC0000] opacity-5 transform rotate-2" />
  </div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
    <div class="text-center">
      <!-- Main Title -->
      <div class="inline-block transform -rotate-1">
        <h1 class="text-4xl sm:text-6xl font-bold text-[#F5E6D3] mb-2 uppercase tracking-wider">
          Space FOMO Relief
        </h1>
        <div class="h-1 bg-[#CC0000] transform rotate-1" />
      </div>

      <!-- Subtitle -->
      <p class="mt-8 text-xl sm:text-2xl text-[#F5E6D3]/80 font-mono max-w-2xl mx-auto">
        Your daily intelligence briefing on space developments, 
        <span class="text-[#CC0000]">comrade</span>.
      </p>

      <!-- Email Signup -->
      <div class="mt-12 max-w-xl mx-auto">
        <form 
          class="sm:flex justify-center"
          on:submit|preventDefault={handleSubmit}
        >
          <input 
            type="email" 
            bind:value={email}
            placeholder="Enter your email" 
            class="w-full sm:w-96 px-6 py-3 text-[#2C2C2C] bg-[#F5E6D3] placeholder-[#2C2C2C]/60 border-2 border-[#CC0000] focus:outline-none focus:border-[#A30000]"
          />
          <Button 
            type="submit"
            class="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 bg-[#CC0000] text-[#F5E6D3] px-8 py-3 uppercase tracking-wider hover:bg-[#A30000] transition-colors duration-200 font-bold transform -rotate-1 hover:rotate-0"
          >
            Join Forces
          </Button>
        </form>
      </div>

      <!-- Stats -->
      <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div class="border-l-2 border-[#CC0000] pl-4">
          <p class="text-4xl font-bold text-[#CC0000]">24/7</p>
          <p class="mt-1 text-[#F5E6D3]/80 uppercase tracking-wide">Surveillance</p>
        </div>
        <div class="border-l-2 border-[#CC0000] pl-4">
          <p class="text-4xl font-bold text-[#CC0000]">100</p>
          <p class="mt-1 text-[#F5E6D3]/80 uppercase tracking-wide">Words or Less</p>
        </div>
        <div class="border-l-2 border-[#CC0000] pl-4">
          <p class="text-4xl font-bold text-[#CC0000]">1000+</p>
          <p class="mt-1 text-[#F5E6D3]/80 uppercase tracking-wide">Comrades</p>
        </div>
      </div>
    </div>
  </div>
</section>