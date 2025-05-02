<!-- src/lib/features/news/tags/SmallTags.svelte -->
<script lang="ts">
  let { tags, limit } = $props<{
    tags: string[];
    limit?: number;
  }>();
  
  // If no limit is provided, show all tags
  const displayLimit = limit || tags.length;
  const displayTags = $derived(tags.slice(0, displayLimit));
  const hasMoreTags = $derived(tags.length > displayLimit);
</script>

<div class="flex flex-wrap gap-1.5">
  {#each displayTags as tag}
    <span class="rounded-md bg-zinc-800/30 border border-zinc-800/40 px-2 py-0.5 text-xs text-zinc-400/50 truncate max-w-[120px]">
      #{tag}
    </span>
  {/each}
  
  {#if hasMoreTags}
    <span class="rounded-md bg-zinc-800/30 border border-zinc-800/40 px-2 py-0.5 text-xs text-zinc-400/50">
      +{tags.length - displayLimit} more
    </span>
  {/if}
</div>