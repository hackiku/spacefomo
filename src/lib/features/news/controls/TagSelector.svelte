<!-- src/lib/features/news/controls/TagSelector.svelte -->
<script lang="ts">
  import { Check, Plus } from 'phosphor-svelte';

  let { 
    availableTags = [],
    selectedTags = [], 
    onTagToggle,
    onClearTags
  } = $props<{
    availableTags: string[];
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
    onClearTags: () => void;
  }>();
</script>

<div class="space-y-3 w-full">
  <div class="flex flex-wrap gap-2">
    {#each availableTags as tag}
      {@const isSelected = selectedTags.includes(tag)}
      <button
        type="button"
        class="group relative flex items-center gap-1.5 px-2.5 py-1 text-xs
               transition-all duration-200 truncate max-w-[110px]
               {isSelected 
                 ? 'bg-primary/20 text-primary border border-primary/40' 
                 : 'border border-border text-muted-foreground hover:text-foreground'}
               before:absolute before:inset-0
               before:border before:border-primary/0
               before:translate-x-0.5 before:translate-y-0.5
               before:transition-transform before:duration-300
               hover:before:border-primary/10
               hover:before:translate-x-0 hover:before:translate-y-0"
        onclick={() => onTagToggle(tag)}
        aria-pressed={isSelected}
      >
        <span class="truncate">{tag}</span>
        {#if isSelected}
          <Check weight="bold" class="h-3 w-3 flex-shrink-0" />
        {:else}
          <Plus weight="bold" class="h-3 w-3 opacity-50 group-hover:opacity-100 flex-shrink-0" />
        {/if}
      </button>
    {/each}

    {#if availableTags.length === 0}
      <p class="text-sm text-muted-foreground">No tags available</p>
    {/if}
  </div>

  {#if selectedTags.length > 0}
    <div class="flex items-center justify-between">
      <span class="text-xs text-muted-foreground">{selectedTags.length} selected</span>
      <button
        type="button"
        class="text-xs text-primary hover:text-secondary transition-colors"
        onclick={onClearTags}
      >
        Clear all
      </button>
    </div>
  {/if}
</div>