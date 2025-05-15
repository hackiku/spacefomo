<!-- src/lib/components/dev/ViewportSize.svelte -->

<script lang="ts">
  import { dev } from '$app/environment';
  import { onMount } from 'svelte';

  let width = $state(0);
  let height = $state(0);
  let showDimensions = $state(false);
  let mounted = $state(false);

  onMount(() => {
    if (typeof window === 'undefined') return;

    const updateSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    mounted = true;

    return () => window.removeEventListener('resize', updateSize);
  });
</script>

{#if dev && mounted}
  <button
    class="fixed top-12 sm:top-4 right-4 z-[100] 
           rounded-lg border border-zinc-800 bg-zinc-900/95 px-3 py-2 
           backdrop-blur-sm hover:bg-zinc-800/80 transition-colors"
    onclick={() => showDimensions = !showDimensions}
  >
    <div class="flex items-center gap-2 font-mono text-sm text-zinc-400">
      {#if showDimensions}
        <span class="tabular-nums">
          {width}x{height}
        </span>
        <span class="text-zinc-600">|</span>
      {/if}
      
      <span class="inline sm:hidden">xs</span>
      <span class="hidden sm:inline md:hidden">sm</span>
      <span class="hidden md:inline lg:hidden">md</span>
      <span class="hidden lg:inline xl:hidden">lg</span>
      <span class="hidden xl:inline 2xl:hidden">xl</span>
      <span class="hidden 2xl:inline">2xl</span>
    </div>
  </button>
{/if}