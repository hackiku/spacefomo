<!-- src/lib/components/proof/SocialProof.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  // Props for customization
  export let activeReaders = 142;
  export let totalSubscribers = 1248;
  export let avatarCount = 4;
  export let showReaderCount = true;
  export let showSubscribers = true;
  
  // Optional animation for reader count
  let displayedReaders = activeReaders;
  let interval: NodeJS.Timer;
  
  onMount(() => {
    if (showReaderCount) {
      // Simulate small fluctuations in active readers
      interval = setInterval(() => {
        const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
        displayedReaders = Math.max(activeReaders + variation, 1);
      }, 3000);
    }
    
    return () => clearInterval(interval);
  });
</script>

<!-- Live reader count -->
{#if showReaderCount}
  <div class="flex items-center gap-2 text-sm">
    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
    <span class="dark:text-zinc-400 light:text-zinc-600">
      <span class="font-medium text-emerald-500">{displayedReaders}</span> reading now
    </span>
  </div>
{/if}

<!-- Subscriber social proof -->
{#if showSubscribers}
  <div class="flex items-center gap-4 text-sm dark:text-zinc-500 light:text-zinc-600">
    <div class="flex -space-x-2">
      {#each Array(avatarCount) as _}
        <div class="w-6 h-6 rounded-full border-2 
                    dark:border-black dark:bg-zinc-800
                    light:border-white light:bg-zinc-200" />
      {/each}
    </div>
    <p>Join {totalSubscribers.toLocaleString()} space enthusiasts</p>
  </div>
{/if}