<!-- src/lib/features/news/article/content/Summary.svelte -->
<script lang="ts">
  let { summary } = $props<{
    summary: string | null;
  }>();
</script>

<div class="rounded-xl bg-zinc-800/20 border-l-4 border-violet-500/40 border-t border-r border-b border-zinc-700/30 p-5">
  <h3 class="text-sm font-medium text-zinc-300 mb-2">Summary</h3>
  <p class="text-lg leading-relaxed text-zinc-200">
    {summary}
  </p>
</div>