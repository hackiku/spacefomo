<!-- $lib/components/Hero.svelte -->

<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.ts";
</script>

<section class="flex flex-col items-center text-center
	mt-8 mx-auto max-w-2xl p-8">
  <h1 class="text-4xl font-bold mb-4">
		Space Race FOMO relief
		<span class="font-mono text-gray-500">in 100 words a pop</span>
	</h1>
  <p class="text-lg mb-8">AI-digested space industry news you can't afford to miss.</p>
  <form class="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
    <input 
      type="email" 
      placeholder="Your email" 
      class="w-full md:w-auto p-2 rounded-lg border"
    />
    <Button class="text-lg w-full md:w-auto">Stay Tuned</Button>
  </form>
</section>
