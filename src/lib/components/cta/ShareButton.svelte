<!-- src/lib/components/cta/ShareButton.svelte -->
<script lang="ts">
  import { Plus } from 'phosphor-svelte';
  
  let { 
    variant = 'default', 
    onClick 
  } = $props<{ 
    variant?: 'default' | 'icon', 
    onClick: () => void 
  }>();
</script>

{#if variant === 'default'}
  <!-- Default button with text and icon -->
  <button
    onclick={onClick}
    class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500
           to-fuchsia-500 px-6 py-3
           font-medium text-white
           transition-all hover:from-violet-600 hover:to-fuchsia-600
           hover:shadow-lg hover:shadow-violet-500/25"
  >
    <Plus weight="bold" class="h-5 w-5" />
    <span>Share News</span>
  </button>
{:else}
  <!-- Icon-only button -->
  <button
    onclick={onClick}
    class="inline-flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-r from-violet-500
           to-fuchsia-500 
           transition-all hover:from-violet-600 hover:to-fuchsia-600
           hover:shadow-lg hover:shadow-violet-500/25"
    aria-label="Share News"
  >
    <Plus weight="bold" class="h-5 w-5" />
  </button>
{/if}