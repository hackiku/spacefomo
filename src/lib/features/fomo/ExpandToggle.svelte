<!-- src/lib/features/fomo/ExpandToggle.svelte -->
<script lang="ts">
  import { CaretDown } from 'phosphor-svelte';

  let { 
    isExpanded = false,
    onToggle = () => {}
  } = $props<{
    isExpanded?: boolean;
    onToggle?: () => void;
  }>();
</script>

<button 
  type="button"
  class="rounded-lg p-1 hover:bg-zinc-700/50 transition-colors"
  onclick={onToggle}
  aria-expanded={isExpanded}
  aria-label={isExpanded ? 'Show less' : 'Show more'}
>
  <div class="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-transform duration-200"
       class:rotate-180={isExpanded}>
    <CaretDown />
  </div>
</button>