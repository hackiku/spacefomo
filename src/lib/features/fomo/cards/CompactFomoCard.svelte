<!-- src/lib/features/fomo/cards/CompactFomoCard.svelte -->
<script lang="ts">
  let { 
    score,
    emoji,
    isActive = false
  } = $props<{
    score: number;
    emoji: string;
    isActive?: boolean;
  }>();
</script>

<div class="flex items-center gap-2 p-3 rounded-xl transition-all duration-200
            {isActive ? 'bg-zinc-800 border border-zinc-700' : 'bg-zinc-800/50 border border-zinc-800'}">
  <span class="text-xl font-medium bg-clip-text text-transparent 
               bg-gradient-to-br from-violet-400 to-fuchsia-500">
    {score}
  </span>
  <span class="text-lg">{emoji}</span>
</div>