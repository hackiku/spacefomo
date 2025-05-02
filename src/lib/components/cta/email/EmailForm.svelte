<!-- // src/lib/components/email/EmailForm.svelte -->
<script lang="ts">
  import { Rocket, LockLaminated, Envelope, Check } from 'phosphor-svelte';
  import { fly } from 'svelte/transition';
  import Status from './Status.svelte';

  let email = $state('');
  let loading = $state(false);
  let success = $state(false);
  let error = $state('');

  async function handleSubmit() {
    if (!email) {
      error = 'Email is required';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error = 'Please enter a valid email address';
      return;
    }

    loading = true;
    error = '';

    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscribe',
          email 
        })
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

  $effect(() => {
    if (email) error = '';
  });
</script>

<div class="w-full max-w-md mx-auto">
  {#if !success}
    <div class="space-y-4">
      <h3 class="text-xl font-medium text-zinc-100">Stay in the orbital loop</h3>
      <p class="text-zinc-400">Get weekly space news updates and never miss a launch.</p>
      
      <form 
        on:submit|preventDefault={handleSubmit}
        class="relative mt-4"
      >
        <div class="flex items-stretch h-14 rounded-full border border-zinc-600 overflow-hidden">
          <div class="flex items-center pl-4 w-10">
            <Envelope weight="light" class="w-5 h-5 text-zinc-500/40" />
          </div>
          
          <input
            type="email"
            bind:value={email}
            placeholder="you@email.com"
            class="min-w-[120px] flex-1 px-2 bg-transparent text-base
                 text-zinc-100 placeholder:text-zinc-600
                 border-0 focus:outline-none focus:ring-1 
                 focus:ring-zinc-700 rounded-lg"
            disabled={loading}
          />
          
          <div class="p-2">
            <button
              type="submit"
              class="h-10 px-5 flex items-center gap-2 
                   rounded-full
                   bg-gradient-to-r from-violet-600 to-fuchsia-600
                   text-zinc-100 font-medium
                   transition-all hover:from-violet-500 hover:to-fuchsia-500
                   disabled:opacity-50"
              disabled={loading}
            >
              {#if loading}
                <LockLaminated weight="light" class="w-4 h-4 animate-spin" />
                <span class="hidden sm:inline">Joining...</span>
              {:else}
                <Rocket weight="bold" class="w-4 h-4" />
                <span class="hidden sm:inline">Join Crew</span>
              {/if}
            </button>
          </div>
        </div>

        {#if error}
          <Status type="error" message={error} />
        {/if}
      </form>
      
      <p class="text-xs text-zinc-500 mt-2">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  {:else}
    <div 
      class="relative border border-zinc-800 rounded-lg p-6 bg-zinc-900/70 backdrop-blur-sm"
      in:fly={{ y: 20, duration: 300 }}
    >
      <div class="flex items-center gap-3">
        <div class="bg-emerald-500/20 rounded-full p-2">
          <Check weight="bold" class="w-6 h-6 text-emerald-400" />  
        </div>
        <div class="text-xl font-medium text-zinc-200">
          You're on the launch pad! 🚀
        </div>
      </div>
      <p class="text-zinc-400 mt-3">
        Check your inbox for a confirmation email. Click the link to confirm your subscription.
      </p>
    </div>
  {/if}
</div>