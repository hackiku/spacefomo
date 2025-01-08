<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  let email = ""
  
  function handleSubmit() {
    // TODO: Implement email subscription
    console.log('Email submitted:', email)
  }
</script>

<section class="py-12 border-b border-zinc-800">
  <div class="max-w-3xl mx-auto px-4">
    <div class="flex flex-col gap-8">
      <!-- Title -->
      <h1 class="text-6xl font-medium text-zinc-100 tracking-tight">
        Space industry FOMO relief
      </h1>

      <!-- Subtitle -->
      <p class="text-2xl text-zinc-400 leading-relaxed">
        Weekly space news digest in 1 minute a pop.
      </p>

      <!-- Email Signup -->
      <form 
        class="flex flex-col sm:flex-row gap-4"
        on:submit|preventDefault={handleSubmit}
      >
        <input 
          type="email" 
          bind:value={email}
          placeholder="Enter your email" 
          class="flex-1 px-4 py-3 bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 focus:border-zinc-600 rounded-md text-lg"
        />
        <Button 
          type="submit"
          variant="default"
          class="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-lg font-medium px-8"
        >
          Subscribe
        </Button>
      </form>
    </div>
  </div>
</section>