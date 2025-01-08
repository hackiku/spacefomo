<!-- src/lib/components/cta/SendNews.svelte -->
<script lang="ts">
  import { Plus, X, Send, Loader2 } from 'lucide-svelte';
  import { scale, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { Button } from '$lib/components/ui/button';
  
  let isOpen = false;
  let url = '';
  let loading = false;
  let status: 'idle' | 'success' | 'error' = 'idle';
  
  // Track click position for animation origin
  let clickX = 0;
  let clickY = 0;
  
  function handleButtonClick(event: MouseEvent) {
    if (!isOpen) {
      // Store click position for animation
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      clickX = event.clientX - rect.left;
      clickY = event.clientY - rect.top;
    }
    isOpen = !isOpen;
  }
  
  async function handleSubmit() {
    if (!url) return;
    
    loading = true;
    status = 'idle';
    
    try {
      const response = await fetch('/api/submit-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) throw new Error();
      
      status = 'success';
      url = '';
      setTimeout(() => isOpen = false, 1500);
    } catch (err) {
      status = 'error';
    } finally {
      loading = false;
    }
  }
  
  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      isOpen = false;
    }
  }
</script>

<!-- Backdrop when open -->
{#if isOpen}
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    on:click={handleOutsideClick}
    transition:fade={{ duration: 200 }}
  >
    <!-- Modal-like Form -->
    <div
      class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md
             bg-zinc-900 rounded-3xl border border-zinc-800/50 overflow-hidden
             shadow-xl"
      style="transform-origin: {clickX}px {clickY}px"
      transition:scale={{ 
        duration: 300,
        easing: cubicOut,
        start: 0.5,
      }}
    >
      <div class="p-8">
        <h2 class="text-2xl font-medium text-zinc-100 mb-6">
          Submit a space news link
        </h2>
        
        <div class="space-y-6">
          <div>
            <input
              type="url"
              bind:value={url}
              placeholder="Paste URL here"
              class="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3
                     text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600
                     transition-colors"
            />
          </div>
          
          <div class="flex justify-end">
            <Button
              on:click={handleSubmit}
              disabled={loading || !url}
              class="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 gap-2"
            >
              {#if loading}
                <Loader2 class="w-4 h-4 animate-spin" />
                Sending...
              {:else}
                <Send class="w-4 h-4" />
                Send Link
              {/if}
            </Button>
          </div>
          
          {#if status === 'success'}
            <p class="text-green-400 text-sm">Link submitted successfully!</p>
          {:else if status === 'error'}
            <p class="text-red-400 text-sm">Failed to submit link. Please try again.</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Floating Action Button -->
<button
  class="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center
         bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
         shadow-lg hover:shadow-xl transition-all duration-200 text-white
         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
  on:click={handleButtonClick}
>
  {#if isOpen}
    <X class="w-6 h-6" />
  {:else}
    <Plus class="w-6 h-6" />
  {/if}
</button>