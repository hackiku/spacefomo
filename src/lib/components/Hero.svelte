<!-- $lib/components/Hero.svelte -->

<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.ts";
</script>

<section class="flex flex-col items-center text-center mt-16 mb-16 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
  <h1 class="text-5xl sm:text-6xl font-bold mb-6">
    Space craze FOMO relief
    <span class="font-mono block mt-2 text-2xl sm:text-3xl">in ~100 words a pop</span>
  </h1>
  <form class="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 w-full max-w-md">
    <input 
      type="email" 
      placeholder="Email" 
      class="w-full sm:w-2/3 py-3 px-6 rounded-full border text-lg"
    />
    <Button class="text-xl h-12 py-3 px-6 rounded-full w-full sm:w-1/3">Stay Spacey</Button>
  </form>
</section>