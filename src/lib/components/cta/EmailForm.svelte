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
    <!-- Ambient glow -->
    <div class="absolute -inset-1 bg-blue-500/20 blur-xl group-hover:bg-blue-500/30 
                transition-all duration-500 opacity-0 group-hover:opacity-100" />
    
    <!-- Main container -->
    <div class="relative bg-black border border-blue-500/30">
      <!-- Corner accents -->
      <div class="absolute top-0 left-0 w-4 h-4 border-l border-t border-blue-500" />
      <div class="absolute top-0 right-0 w-4 h-4 border-r border-t border-blue-500" />
      <div class="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-blue-500" />
      <div class="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-blue-500" />
      
      <div class="flex items-center p-1">
        <input
          type="email"
          bind:value={email}
          placeholder="your@email.com"
          class="flex-1 bg-transparent px-4 py-3 text-blue-100 placeholder-blue-900
                 focus:outline-none font-mono"
          disabled={loading}
        />
        
        <Button
          type="submit"
          variant="default"
          class="relative group/btn bg-blue-950 hover:bg-blue-900 border border-blue-500/50
                 text-blue-400 hover:text-blue-300 shadow-lg flex items-center gap-2 px-6"
          disabled={loading}
        >
          <div class="absolute inset-0 bg-blue-500/20 blur-sm opacity-0 
                      group-hover/btn:opacity-100 transition-opacity" />
          <div class="relative">
            {#if loading}
              <Loader2 class="w-4 h-4 animate-spin" />
              <span>CONNECTING...</span>
            {:else}
              <Rocket class="w-4 h-4" />
              <span>SUBSCRIBE</span>
            {/if}
          </div>
        </Button>
      </div>
    </div>

    {#if error}
      <div 
        class="absolute -bottom-6 left-0 text-sm text-red-400 font-mono"
        transition:fly={{ y: -10, duration: 200 }}
      >
        >> ERROR: {error}
      </div>
    {/if}
  </form>
{:else}
  <div 
    class="relative"
    in:fly={{ y: 20, duration: 300 }}
  >
    <div class="absolute -inset-1 bg-green-500/20 blur-xl" />
    <div class="relative bg-black border border-green-500/30 p-6 text-center">
      <div class="text-xl font-medium text-green-400 mb-2 font-mono">
        >> CONNECTION ESTABLISHED
      </div>
      <p class="text-green-600 font-mono">
        Check your terminal for confirmation.
      </p>
    </div>
  </div>
{/if}

<style>
  input::placeholder {
    color: rgba(59, 130, 240, 0.3);
  }
</style>