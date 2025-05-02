<!-- src/lib/features/news/article/data/EntitySection.svelte -->
<script lang="ts">
  let { 
    title, 
    items, 
    nameKey = 'name', 
    detailKey = 'role'
  } = $props<{
    title: string;
    items: Record<string, any>[];
    nameKey?: string;
    detailKey?: string;
  }>();
</script>

<div class="rounded-xl bg-zinc-800/20 border border-zinc-700/30 p-5">
  <h3 class="text-sm font-medium text-zinc-300 mb-3">{title}</h3>
  <div class="space-y-2.5">
    {#each items as item}
      <div class="flex items-baseline justify-between">
        <span class="text-zinc-200">{item[nameKey]}</span>
        {#if item[detailKey]}
          <span class="text-zinc-500 text-sm">{item[detailKey]}</span>
        {/if}
      </div>
    {/each}
  </div>
</div>