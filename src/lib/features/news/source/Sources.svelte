<!-- src/lib/features/news/source/Sources.svelte -->
<script lang="ts">
  let { sources, activeSource, onSelectSource } = $props<{
    sources: Array<{name: string, id: string | number}>;
    activeSource: string | number;
    onSelectSource: (id: string | number) => void;
  }>();
</script>

<div class="flex flex-wrap items-center gap-2 mb-3">
  
  {#each sources as source (source.id)}
    <button
      type="button"
      class="px-3 py-1.5 text-sm rounded-full transition-all {
        source.id === activeSource 
          ? 'bg-violet-600/30 text-violet-300 border border-violet-700/50'
          : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-800 hover:text-zinc-300'
      }"
      onclick={() => onSelectSource(source.id)}
    >
      {source.name}
    </button>
  {/each}
</div>