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
      <p class="text-xs text-muted-foreground font-medium">FOMO Threshold</p>
      <div class="fomo-score text-sm">{fomoThreshold}</div>
    </div>

    <input
      type="range"
      min="0"
      max="100"
      value={fomoThreshold}
      onchange={(e) => onFomoThresholdChange(parseInt(e.currentTarget.value))}
      oninput={(e) => onFomoThresholdChange(parseInt(e.currentTarget.value))}
      class="w-full appearance-none bg-muted h-2 accent-primary"
    />
  </div>

  <!-- Tags Selection with adaptive layout -->
  {#if !compact}
    <div class="space-y-2">
      <p class="text-xs text-muted-foreground font-medium">Filter by Tags</p>
      <div class="border border-border bg-muted/30 p-2">
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
      <p class="text-xs text-muted-foreground font-medium">Tags</p>
      <div class="flex flex-wrap gap-1">
        {#each availableTags as tag}
          {@const isSelected = selectedTags.includes(tag)}
          <button
            type="button"
            class="px-2 py-0.5 text-xs border
                   transition-colors
                   {isSelected 
                     ? 'bg-primary/20 text-primary border-primary/40' 
                     : 'border-border text-muted-foreground hover:text-foreground'}"
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
  <div class="flex items-center gap-2">
    <button
      type="button"
      class="relative inline-flex h-5 w-9 items-center
             transition-colors duration-200 flex-shrink-0
             {showOnlyActive ? 'bg-primary' : 'bg-muted'}"
      role="switch"
      aria-checked={showOnlyActive}
      onclick={() => onShowOnlyActiveChange(!showOnlyActive)}
    >
      <span
        class="inline-block h-4 w-4 transform bg-card shadow-sm
               transition-transform duration-200 ease-in-out
               {showOnlyActive ? 'translate-x-5' : 'translate-x-1'}"
      />
    </button>
    <span class="text-xs text-muted-foreground">Active week only</span>
  </div>
</div>