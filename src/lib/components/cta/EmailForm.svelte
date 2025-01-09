<!-- src/lib/components/cta/EmailForm.svelte -->
<script lang="ts">
  import { Rocket, Loader2, Mail } from 'lucide-svelte';
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
    <div class="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200" />
    
    <!-- Main container -->
    <div class="relative flex items-center rounded-full overflow-hidden
                bg-white/50 dark:bg-black/50 backdrop-blur-sm">
      <div class="pl-5">
        <Mail class="w-5 h-5 text-zinc-400/50 dark:text-zinc-600/50" />
      </div>
      
      <input
        type="email"
        bind:value={email}
        placeholder="you@email.com"
        class="flex-1 px-4 py-4 bg-transparent text-lg
               text-zinc-900 dark:text-white 
               placeholder:text-zinc-400/50 dark:placeholder:text-zinc-600/50
               border-0 focus:outline-none"
        disabled={loading}
      />
      
      <div class="p-1.5 pr-2">
        <Button
          type="submit"
          variant="default"
          class="rounded-full px-6 py-3 flex items-center gap-2 transition-colors
                 bg-violet-500 hover:bg-violet-600 text-white"
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
    </div>

    {#if error}
      <div 
        class="absolute -bottom-6 left-0 text-sm text-red-500 dark:text-red-400"
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
    <div class="relative rounded-full overflow-hidden p-6 text-center
                bg-emerald-50 dark:bg-emerald-500/10 
                border border-emerald-200 dark:border-emerald-500/20">
      <div class="text-xl font-medium mb-2 text-emerald-700 dark:text-emerald-400">
        You're on the launch pad! 🚀
      </div>
      <p class="text-emerald-600 dark:text-emerald-500">
        Check your inbox for confirmation.
      </p>
    </div>
  </div>
{/if}