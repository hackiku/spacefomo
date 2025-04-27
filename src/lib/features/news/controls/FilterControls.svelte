<!-- src/lib/features/news/controls/FilterControls.svelte -->

<script lang="ts">
  import TagSelector from './TagSelector.svelte';
  
  let { 
    fomoThreshold, 
    selectedTags, 
    showOnlyActive,
    compact = false,
    onFomoThresholdChange,
    onSelectedTagsChange,
    onShowOnlyActiveChange
  } = $props<{
    fomoThreshold: number;
    selectedTags: string[];
    showOnlyActive: boolean;
    compact?: boolean;
    onFomoThresholdChange: (value: number) => void;
    onSelectedTagsChange: (tags: string[]) => void;
    onShowOnlyActiveChange: (value: boolean) => void;
  }>();

  // Available tags to filter by - can be expanded
  const availableTags = [
    'SpaceX', 'NASA', 'Rocket Lab', 'Mars', 'Moon'
  ];
  
  // Handle tag selection
  function handleTagToggle(tag: string) {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    onSelectedTagsChange(newTags);
  }
  
  // Handle clearing all tags
  function handleClearTags() {
    onSelectedTagsChange([]);
  }
</script>

<div class="space-y-4 w-full {compact ? 'text-sm' : ''}">
  <!-- FOMO Threshold Slider -->
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <p class="text-xs text-zinc-500">FOMO Threshold</p>
      <span class="text-xs font-medium text-zinc-400">{fomoThreshold}</span>
    </div>

    <input
      type="range"
      min="0"
      max="100"
      value={fomoThreshold}
      onchange={(e) => onFomoThresholdChange(parseInt(e.currentTarget.value))}
      oninput={(e) => onFomoThresholdChange(parseInt(e.currentTarget.value))}
      class="w-full appearance-none bg-zinc-800 h-2 rounded-full accent-violet-500"
    />
  </div>

  <!-- Tags Selection with adaptive layout -->
  {#if !compact}
    <div class="space-y-2">
      <p class="text-xs text-zinc-500">Filter by Tags</p>
      <div class="rounded-lg border border-zinc-800 bg-zinc-900/30 p-2 overflow-hidden">
        <TagSelector 
          availableTags={availableTags} 
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
        />
      </div>
    </div>
  {:else}
    <!-- Compact tag selection -->
    <div class="space-y-2">
      <p class="text-xs text-zinc-500">Tags</p>
      <div class="flex flex-wrap gap-1">
        {#each availableTags as tag}
          {@const isSelected = selectedTags.includes(tag)}
          <button
            type="button"
            class="px-2 py-0.5 text-xs rounded-full border
                   transition-colors
                   {isSelected 
                     ? 'bg-violet-500/20 text-violet-300 border-violet-500/40' 
                     : 'border-zinc-800 text-zinc-500 hover:text-zinc-400'}"
            onclick={() => handleTagToggle(tag)}
            aria-pressed={isSelected}
          >
            {tag}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Show only active toggle switch -->
  <div class="flex items-center space-x-2">
    <button
      type="button"
      class="relative inline-flex h-5 w-9 items-center rounded-full 
             transition-colors duration-200 flex-shrink-0
             {showOnlyActive ? 'bg-violet-600' : 'bg-zinc-700'}"
      role="switch"
      aria-checked={showOnlyActive}
      onclick={() => onShowOnlyActiveChange(!showOnlyActive)}
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white shadow-md
               transition-transform duration-200 ease-in-out
               {showOnlyActive ? 'translate-x-5' : 'translate-x-1'}"
      />
    </button>
    <span class="text-xs text-zinc-400">Active week only</span>
  </div>
</div>