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

  // Reset error on email change
  $: if (email) error = '';
</script>

{#if !success}
  <form 
    on:submit|preventDefault={handleSubmit}
    class="relative"
  >
    <!-- Input group with gradient border -->
    <div class="group relative">
      <div 
        class="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-lg blur opacity-30 
               group-hover:opacity-50 transition duration-500"
      />
      <div class="relative flex items-center gap-2 bg-zinc-900 rounded-lg p-1">
        <input
          type="email"
          bind:value={email}
          placeholder="your@email.com"
          class="flex-1 bg-transparent px-4 py-2 text-zinc-100 placeholder-zinc-500 
                 focus:outline-none"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="default"
          class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                 text-zinc-100 shadow-lg flex items-center gap-2"
          disabled={loading}
        >
          {#if loading}
            <Loader2 class="w-4 h-4 animate-spin" />
            <span>Launching...</span>
          {:else}
            <Rocket class="w-4 h-4" />
            <span>Subscribe</span>
          {/if}
        </Button>
      </div>
    </div>

    {#if error}
      <div 
        class="absolute -bottom-6 left-0 text-sm text-red-400"
        transition:fly={{ y: -10, duration: 200 }}
      >
        {error}
      </div>
    {/if}
  </form>
{:else}
  <div 
    class="bg-zinc-800/50 rounded-lg p-6 text-center border border-zinc-700/50"
    in:fly={{ y: 20, duration: 300 }}
  >
    <div class="text-xl font-medium text-zinc-100 mb-2">
      You're on the launch pad! 🚀
    </div>
    <p class="text-zinc-400">
      Check your inbox for confirmation.
    </p>
  </div>
{/if}