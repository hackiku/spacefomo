<!-- src/lib/features/sidebar/Sidebar.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
  import Controls from '$lib/features/fomo/Controls.svelte';
  import FilterControls from './controls/FilterControls.svelte';
  import FomoCardContainer from '$lib/features/fomo/FomoCardContainer.svelte';
  import type { LayoutOption } from '$lib/types/layout';

  // Layout state via runes
  let activeLayout = $state<LayoutOption['name']>('normal');
  let columnCount = $state(2);
  
  // Filter settings state
  let fomoThreshold = $state(0);
  let selectedTags = $state<string[]>([]);
  let showOnlyActive = $state(false);
  
  // React to changes to update parent
  $effect(() => {
    // Any side effects needed when settings change
    console.log('Sidebar settings updated:', { activeLayout, columnCount, fomoThreshold, selectedTags, showOnlyActive });
  });
</script>

<div class="sticky top-18 flex flex-col gap-12">
  <!-- Controls Section -->
  <Controls bind:activeLayout bind:columnCount />

  <!-- FOMO Card Container -->
  <FomoCardContainer />

  <!-- Filter options -->
  <div class="space-y-4">
    <h3 class="text-base font-medium text-zinc-300">Filters</h3>
    <div class="space-y-6">
      <!-- FOMO Threshold -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-zinc-500">FOMO Threshold</p>
          <span class="text-xs font-medium text-zinc-400">{fomoThreshold}</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          bind:value={fomoThreshold}
          class="w-full appearance-none bg-zinc-800 h-2 rounded-full accent-violet-500"
        />
      </div>

      <!-- Tags Selection -->
      <div class="space-y-2">
        <p class="text-xs text-zinc-500">Filter by Tags</p>
        <div class="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
          <!-- Add your tag selection component here -->
          <div class="flex flex-wrap gap-2">
            {#each ['SpaceX', 'NASA', 'Moon', 'Mars'] as tag}
              {@const isSelected = selectedTags.includes(tag)}
              <button
                type="button"
                class="group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs
                      transition-all duration-200
                      {isSelected 
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' 
                        : 'border border-zinc-700 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
                onclick={() => {
                  if (isSelected) {
                    selectedTags = selectedTags.filter(t => t !== tag);
                  } else {
                    selectedTags = [...selectedTags, tag];
                  }
                }}
              >
                <span>{tag}</span>
              </button>
            {/each}
          </div>
          
          {#if selectedTags.length > 0}
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-zinc-500">{selectedTags.length} selected</span>
              <button
                type="button"
                class="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                onclick={() => selectedTags = []}
              >
                Clear all
              </button>
            </div>
          {/if}
        </div>
      </div>

      <!-- Show only active toggle -->
      <div class="flex items-center space-x-3">
        <button
          type="button"
          class="relative inline-flex h-6 w-11 items-center rounded-full 
                transition-colors duration-200 
                {showOnlyActive ? 'bg-violet-600' : 'bg-zinc-700'}"
          role="switch"
          aria-checked={showOnlyActive}
          onclick={() => showOnlyActive = !showOnlyActive}
        >
          <span
            class="inline-block h-5 w-5 transform rounded-full bg-white shadow-md
                  transition-transform duration-200 ease-in-out
                  {showOnlyActive ? 'translate-x-5' : 'translate-x-1'}"
          />
        </button>
        <span class="text-sm text-zinc-400">Show active week only</span>
      </div>
    </div>
  </div>
</div>