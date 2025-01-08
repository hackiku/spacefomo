<!-- $lib/components/StyleSwitcher.svelte -->
<script lang="ts">
  import { currentStyle } from '$lib/stores/styleStore';
  import type { CardStyle } from '$lib/features/news/styles';
  
  const styles: Array<{ id: CardStyle; name: string }> = [
    { id: 'terminal', name: 'Terminal' },
    { id: 'scifi', name: 'Sci-Fi Magazine' }
  ];

  function handleStyleChange(newStyle: CardStyle) {
    currentStyle.set(newStyle);
  }
</script>

<div class="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-gray-700 z-50">
  <div class="flex gap-2">
    {#each styles as style}
      <button
        class="px-3 py-1 text-sm rounded-md transition-colors"
        class:bg-gray-300={$currentStyle === style.id}
        on:click={() => handleStyleChange(style.id)}
      >
        {style.name}
      </button>
    {/each}
  </div>
</div>