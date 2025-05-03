<!-- src/routes/unsubscribed/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { Rocket, ArrowLeft } from 'phosphor-svelte';
  
  // Extract success parameter from URL
  const success = $page.url.searchParams.get('success') === 'true';
</script>

<div class="min-h-screen pt-20 px-4">
  <div class="max-w-md mx-auto">
    <div class="text-center mb-8">
      <Rocket weight="duotone" class="w-16 h-16 mx-auto text-violet-500 opacity-80" />
      <h1 class="text-3xl font-bold mt-4 text-zinc-100">Unsubscribed</h1>
    </div>
    
    <div class="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      {#if success}
        <p class="text-zinc-300 mb-4">
          You've been successfully unsubscribed from SpaceFomo emails. 
          We're sorry to see you go!
        </p>
        <p class="text-zinc-400 mb-6">
          If you change your mind, you can always resubscribe on our website.
        </p>
      {:else}
        <p class="text-zinc-300 mb-4">
          There was an issue processing your unsubscribe request.
        </p>
        <p class="text-zinc-400 mb-6">
          Please try again or contact support if the issue persists.
        </p>
      {/if}
      
      <a 
        href="/" 
        class="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
      >
        <ArrowLeft weight="bold" class="w-4 h-4" />
        <span>Return to homepage</span>
      </a>
    </div>
  </div>
</div>