<!-- src/lib/components/cta/email/EmailForm.svelte -->
<script lang="ts">
  import { Rocket, LockLaminated, Envelope } from 'phosphor-svelte';
  import { fly } from 'svelte/transition';
  import Status from './Status.svelte';

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

  $: if (email) error = '';
</script>

{#if !success}
    <form 
        on:submit|preventDefault={handleSubmit}
        class="relative"
    >
        <div class="flex items-stretch h-14 rounded-full border border-zinc-600">
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
                    class="h-10 px-4 flex items-center gap-2 
                           border border-zinc-800 rounded-full
                           hover:bg-zinc-800/50 text-zinc-100
                           transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    {#if loading}
                        <LockLaminated weight="light" class="w-4 h-4 animate-spin" />
                        <span class="hidden sm:inline">Joining...</span>
                    {:else}
                        <span class="hidden sm:inline">Join Up</span>
                    {/if}
                </button>
            </div>
        </div>

        {#if error}
            <Status type="error" message={error} />
        {/if}
    </form>
{:else}
    <Status 
        type="success" 
        message="Check your inbox for confirmation." 
    />
{/if}
