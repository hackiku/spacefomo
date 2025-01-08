<!-- src/lib/features/fomo/WeeklyFomo.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
</script>

<div class="flex items-center justify-center gap-2 py-4">
  <div class="text-center">
    <div class="text-6xl font-medium mb-2">{$fomoStore.currentScore}</div>
    <div class="text-muted-foreground">FOMO Level</div>
  </div>
</div>