<!-- src/lib/components/cta/EmailForm.svelte -->
<script lang="ts">
  import { Rocket, Loader2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { fly } from 'svelte/transition';

  let email = '';
  let loading = false;
  let success = false;
  let error = '';

  async function handleSubmit() {
    if (!email) {
      error = 'Email is required';
      return;
    }

    loading = true;
    error = '';

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Subscription failed');

      success = true;
      email = '';
    } catch (err) {
      error = 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }

  $: if (email) error = '';
</script>

{#if !success}
  <form 
    on:submit|preventDefault={handleSubmit}
    class="relative group"
  >
    <!-- Gradient background with theme support -->
    <div class="absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200
                dark:from-violet-600 dark:to-fuchsia-600
                light:from-violet-500 light:to-fuchsia-500" />
    
    <!-- Main container -->
    <div class="relative flex rounded-lg overflow-hidden
                dark:bg-black/50 dark:backdrop-blur-sm
                light:bg-white/50 light:backdrop-blur-sm">
      <input
        type="email"
        bind:value={email}
        placeholder="you@email.com"
        class="flex-1 px-4 py-3 bg-transparent border border-white/10
               dark:text-white dark:placeholder-zinc-500
               light:text-black light:placeholder-zinc-400
               focus:outline-none focus:border-violet-500/50"
        disabled={loading}
      />
      
      <Button
        type="submit"
        variant="default"
        class="px-6 py-3 flex items-center gap-2 transition-colors border-0
               dark:bg-violet-600 dark:hover:bg-violet-500 dark:text-white
               light:bg-violet-500 light:hover:bg-violet-600 light:text-white"
        disabled={loading}
      >
        {#if loading}
          <Loader2 class="w-4 h-4 animate-spin" />
          <span>Joining...</span>
        {:else}
          <Rocket class="w-4 h-4" />
          <span>Join</span>
        {/if}
      </Button>
    </div>

    {#if error}
      <div 
        class="absolute -bottom-6 left-0 text-sm dark:text-red-400 light:text-red-500"
        transition:fly={{ y: -10, duration: 200 }}
      >
        {error}
      </div>
    {/if}
  </form>
{:else}
  <div 
    class="relative"
    in:fly={{ y: 20, duration: 300 }}
  >
    <div class="relative rounded-lg overflow-hidden p-6 text-center
                dark:bg-emerald-500/10 dark:border dark:border-emerald-500/20
                light:bg-emerald-50 light:border light:border-emerald-200">
      <div class="text-xl font-medium mb-2 
                  dark:text-emerald-400 light:text-emerald-700">
        You're on the launch pad! 🚀
      </div>
      <p class="dark:text-emerald-500 light:text-emerald-600">
        Check your inbox for confirmation.
      </p>
    </div>
  </div>
{/if}