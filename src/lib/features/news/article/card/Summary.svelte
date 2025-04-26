<!-- src/lib/features/news/card/Summary.svelte -->
<script lang="ts">
  let { title, viralTitle } = $props<{
    title: string;
    viralTitle: string | null;
  }>();
</script>

<div class="space-y-3">
  <h2 class="text-3xl font-medium leading-tight text-zinc-100">
    {viralTitle || title}
  </h2>
  
  {#if viralTitle && viralTitle !== title}
    <p class="text-lg text-zinc-400 leading-relaxed">
      {title}
    </p>
  {/if}
</div>