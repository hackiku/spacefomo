<!-- src/lib/features/news/controls/FilterControls.svelte -->
<script lang="ts">
  import { useFomo } from '$lib/hooks/useFomo.svelte';
  import { useNews } from '$lib/hooks/useNews.svelte';
  
  // Get context data from hooks
  const { 
    fomoThreshold, 
    selectedTags,
    setFomoThreshold,
    setSelectedTags
  } = useFomo();
  
  const { allItems } = useNews();
  
  // Derived property - get all unique tags from the data
  const availableTags = $derived(() => {
    const tagSet = new Set<string>();
    
    allItems.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    return Array.from(tagSet).sort();
  });
  
  // Handle threshold slider change
  function handleThresholdChange(e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value);
    setFomoThreshold(value);
  }
  
  // Handle tag selection changes
  function handleTagSelect(tag: string) {
    if (selectedTags.includes(tag)) {
      // Remove tag if already selected
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag if not selected
      setSelectedTags([...selectedTags, tag]);
    }
  }
  
  // Clear all selected tags
  function clearTags() {
    setSelectedTags([]);
  }
</script>

<div class="space-y-6">
  <!-- FOMO threshold slider -->
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <label for="fomo-threshold" class="text-xs text-muted-foreground font-medium">
        FOMO Score Threshold
      </label>
      <span class="text-sm font-medium">{fomoThreshold}</span>
    </div>
    
    <input
      id="fomo-threshold"
      type="range"
      min="0"
      max="100"
      value={fomoThreshold}
      onchange={handleThresholdChange}
      oninput={handleThresholdChange}
      class="w-full appearance-none bg-muted h-2 rounded-md accent-primary"
    />
  </div>
  
  <!-- Tags filter -->
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <label class="text-xs text-muted-foreground font-medium">Tags</label>
      {#if selectedTags.length > 0}
        <button 
          type="button"
          class="text-xs text-primary hover:underline"
          onclick={clearTags}
        >
          Clear ({selectedTags.length})
        </button>
      {/if}
    </div>
    
    <div class="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
      {#each availableTags as tag}
        <button
          type="button"
          class="bg-muted border border-border px-2 py-0.5 text-xs rounded-sm transition-colors"
          class:bg-card={selectedTags.includes(tag)}
          class:border-card={selectedTags.includes(tag)}
          class:text-foreground={selectedTags.includes(tag)}
          class:text-muted-foreground={!selectedTags.includes(tag)}
          onclick={() => handleTagSelect(tag)}
        >
          {tag}
        </button>
      {/each}
      
      {#if availableTags.length === 0}
        <span class="text-xs text-muted-foreground italic">No tags available</span>
      {/if}
    </div>
  </div>
</div>