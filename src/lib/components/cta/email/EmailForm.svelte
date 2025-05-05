<!-- src/lib/components/email/EmailForm.svelte -->
<script lang="ts">
  import { Rocket, ArrowClockwise, Envelope } from 'phosphor-svelte';
  import { Button } from 'bits-ui';
  import { fly } from 'svelte/transition';

  let email = $state('');
  let loading = $state(false);
  let success = $state(false);
  let error = $state('');
  let inputElement: HTMLInputElement;
  let isFocused = $state(false);

  async function handleSubmit() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error = !email ? 'Email is required' : 'Please enter a valid email address';
      return;
    }

    loading = true;
    error = '';

    try {
      const response = await fetch('/api/email', {
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

  function handleFocus() {
    isFocused = true;
    error = '';
  }

  function handleBlur() {
    isFocused = false;
  }

  $effect(() => {
    if (email) error = '';
  });
</script>

<!-- onsubmit|preventDefault={handleSubmit} -->
<form 
  onsubmit={handleSubmit}
  class="relative max-w-sm"
>
  {#if !success}
    <div 
      class="flex items-stretch h-14 rounded-full border border-zinc-700/80 bg-zinc-800/30 
             overflow-hidden {isFocused ? 'ring-1 ring-zinc-500 border-zinc-600' : ''}"
    >
      <div class="flex items-center justify-center pl-4 w-10">
        <Envelope weight="light" class="w-5 h-5 text-zinc-500/50" />
      </div>

      <input
        type="email"
        bind:value={email}
        bind:this={inputElement}
        placeholder="your@email.com"
        onfocus={handleFocus}
        onblur={handleBlur}
        class="min-w-[120px] flex-1 px-2 bg-transparent text-zinc-100 
               placeholder:text-zinc-600/70 border-0 outline-none 
               focus:ring-0 h-full"
        disabled={loading}
      />
      
      <div class="p-1.5">
        <Button.Root
          type="submit"
          disabled={loading}
          class="h-full px-5 flex items-center justify-center gap-2 
                 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600
                 text-zinc-100 font-medium whitespace-nowrap
                 transition-all hover:from-violet-500 hover:to-fuchsia-500
                 disabled:opacity-50"
        >
          {#if loading}
            <ArrowClockwise weight="bold" class="w-4 h-4 animate-spin" />
          {:else}
            <Rocket weight="bold" class="w-4 h-4" />
          {/if}
          <span>Join</span>
        </Button.Root>
      </div>
    </div>

    {#if error}
      <p class="absolute -bottom-6 ml-10 text-sm text-zinc-400/80" transition:fly={{ y: -10, duration: 200 }}>
        {error}
      </p>
    {/if}
  {:else}
    <div 
      class="flex items-center gap-2 py-3 px-4 rounded-full
             bg-zinc-800/40 border border-zinc-700/80 text-zinc-300 text-sm"
      in:fly={{ y: 10, duration: 300 }}
    >
      <Rocket weight="fill" class="w-4 h-4 text-emerald-400" />
      <span>Thanks for joining! Check your inbox.</span>
    </div>
  {/if}
</form>