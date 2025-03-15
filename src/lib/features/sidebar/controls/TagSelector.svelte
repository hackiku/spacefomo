<!-- src/lib/features/sidebar/controls/TagSelector.svelte -->
<script lang="ts">
  import { Check, Plus } from 'phosphor-svelte';

  let { 
    availableTags = [], 
    selectedTags = $bindable<string[]>([]) 
  } = $props<{
    availableTags: string[];
    selectedTags?: string[];
  }>();

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }
</script>

<div class="space-y-3">
  <div class="flex flex-wrap gap-2">
    {#each availableTags as tag}
      {@const isSelected = selectedTags.includes(tag)}
      <button
        type="button"
        class="group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs
               transition-all duration-200
               {isSelected 
                 ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' 
                 : 'border border-zinc-700 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
        onclick={() => toggleTag(tag)}
        aria-pressed={isSelected}
      >
        <span>{tag}</span>
        {#if isSelected}
          <Check weight="bold" class="h-3 w-3" />
        {:else}
          <Plus weight="bold" class="h-3 w-3 opacity-50 group-hover:opacity-100" />
        {/if}
      </button>
    {/each}

    {#if availableTags.length === 0}
      <p class="text-sm text-zinc-500">No tags available</p>
    {/if}
  </div>

  {#if selectedTags.length > 0}
    <div class="flex items-center justify-between">
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