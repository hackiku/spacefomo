<!-- src/lib/features/sidebar/controls/FilterControls.svelte -->
<script lang="ts">
  import TagSelector from './TagSelector.svelte';
  
  let { 
    fomoThreshold = $bindable(0),
    selectedTags = $bindable<string[]>([]),
    showOnlyActive = $bindable(false)
  } = $props<{
    fomoThreshold?: number;
    selectedTags?: string[];
    showOnlyActive?: boolean;
  }>();

  // Available tags for filtering - ideally this would come from API/store
  const availableTags = [
    'SpaceX', 'NASA', 'Rocket Lab', 'Blue Origin', 
    'Virgin Galactic', 'Mars', 'Moon', 'ISS'
  ];
</script>

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
      <TagSelector 
        availableTags={availableTags} 
        bind:selectedTags
      />
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