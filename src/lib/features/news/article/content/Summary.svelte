<!-- src/lib/features/news/article/content/Summary.svelte -->
<script lang="ts">
  let { summary } = $props<{
    summary: string | null;
  }>();
</script>

<div class="__bg-card/30">
  <!-- <h3 class="text-sm font-medium text-foreground/80 mb-2">Summary</h3> -->
  <p class="text-lg leading-relaxed text-foreground">
    {summary}
  </p>
</div>