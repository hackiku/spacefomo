<!-- src/lib/components/cta/send/SendNews.svelte -->
<script lang="ts">
  import { Plus, X, Send, Loader2 } from 'lucide-svelte';
  import { scale, slide, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import ScoreSelector from '../../features/fomo/ScoreSelector.svelte';
  import EmailField from './send/EmailField.svelte';
  import LinkField from './send/LinkField.svelte';
  
  let isOpen = false;
  let url = '';
  let email = '';
  let comment = '';
  let fomoScore: number | null = null;
  let loading = false;
  let status: 'idle' | 'success' | 'error' = 'idle';
  
  // Track click position for animation origin
  let clickX = 0;
  let clickY = 0;
  
  function handleButtonClick(event: MouseEvent) {
    if (!isOpen) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      clickX = event.clientX - rect.left;
      clickY = event.clientY - rect.top;
    }
    isOpen = !isOpen;
  }
  
  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      isOpen = false;
    }
  }
  
  async function handleSubmit() {
    if (!url) return;
    
    loading = true;
    status = 'idle';
    
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'send-news',
          url,
          comment: comment || undefined,
          fomoScore: fomoScore || undefined,
          email: email || undefined
        })
      });
      
      if (!response.ok) throw new Error();
      
      status = 'success';
      url = '';
      comment = '';
      fomoScore = null;
      email = '';
      setTimeout(() => isOpen = false, 1500);
    } catch (err) {
      status = 'error';
    } finally {
      loading = false;
    }
  }
</script>

{#if isOpen}
  <button
    class="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm z-40"
    on:click={handleOutsideClick}
    transition:fade={{ duration: 200 }}
  >
    <button
      class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl
             bg-zinc-900/95 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-sm
             shadow-xl px-6 py-8"
      style="transform-origin: {clickX}px {clickY}px"
      transition:scale={{ duration: 300, easing: cubicOut, start: 0.5 }}
      on:click|stopPropagation
    >
      <h2 class="text-2xl font-medium text-zinc-100 mb-8">
        Submit Space News
      </h2>

      <div class="space-y-6">
        <!-- URL Field -->
        <LinkField bind:value={url} />

        <!-- Comment & Score Row -->
        <div class="flex items-center gap-4">
          <ScoreSelector 
            value={fomoScore}
            onChange={(value) => fomoScore = value}
          />
          
          <div class="flex-1">
            <input
              bind:value={comment}
              placeholder="Why is this interesting?"
              class="w-full bg-transparent border-b border-white/10 py-2
                     text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
        </div>
        
        <!-- Email Field -->
        <EmailField bind:value={email} />
        
        <!-- Send Button -->
        <button
          on:click={handleSubmit}
          disabled={loading || !url}
          class="w-full flex items-center justify-center gap-2 px-6 py-3 
                 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-full
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-200"
        >
          {#if loading}
            <Loader2 class="w-4 h-4 animate-spin" />
            <span>Sending...</span>
          {:else}
            <Send class="w-4 h-4" />
            <span>Send News</span>
          {/if}
        </button>
        
        <!-- Status Messages -->
        {#if status === 'success'}
          <p class="text-green-400 text-sm" transition:fade>Link submitted successfully!</p>
        {:else if status === 'error'}
          <p class="text-red-400 text-sm" transition:fade>Failed to submit link. Please try again.</p>
        {/if}
      </div>
    </button>
  </button>
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