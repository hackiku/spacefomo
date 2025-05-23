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

<form 
  onsubmit={handleSubmit}
  class="relative max-w-sm"
>
  {#if !success}
    <div 
      class="flex items-stretch h-14 border border-border bg-input overflow-hidden
             {isFocused ? 'ring-1 ring-venus-yellow border-venus-yellow/40' : ''}"
    >
      <div class="flex items-center justify-center pl-4 w-10">
        <Envelope weight="light" class="w-5 h-5 text-muted-foreground/50" />
      </div>

      <input
        type="email"
        bind:value={email}
        bind:this={inputElement}
        placeholder="your@email.com"
        onfocus={handleFocus}
        onblur={handleBlur}
        class="min-w-[120px] flex-1 px-2 bg-transparent text-foreground 
               placeholder:text-muted-foreground/50 border-0 outline-none 
               focus:ring-0 h-full"
        disabled={loading}
      />
      
      <div class="p-1.5">
        <Button.Root
          type="submit"
          disabled={loading}
          class="group relative h-full px-5 flex items-center justify-center gap-2 
                 text-primary-foreground font-medium whitespace-nowrap
                 bg-primary transition-all hover:bg-primary/90 disabled:opacity-50
                 border border-transparent
                 before:absolute before:inset-0
                 before:border before:border-primary/50
                 before:translate-x-1 before:translate-y-1
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0"
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
      <p class="absolute -bottom-6 ml-10 text-sm text-muted-foreground" transition:fly={{ y: -10, duration: 200 }}>
        {error}
      </p>
    {/if}
  {:else}
    <div 
      class="flex items-center gap-2 py-3 px-4
             bg-muted border border-venus-yellow/20 text-foreground text-sm"
      in:fly={{ y: 10, duration: 300 }}
    >
      <Rocket weight="fill" class="w-4 h-4 text-primary" />
      <span>Thanks for joining! Check your inbox.</span>
    </div>
  {/if}
</form>