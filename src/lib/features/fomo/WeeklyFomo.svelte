<!-- src/lib/features/fomo/WeeklyFomo.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
</script>

<div class="relative group">
  <!-- Hexagon container with glow -->
  <div class="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-blue-500/30 transition-colors duration-500" />
  
  <div class="relative bg-black border border-blue-500/30 p-8">
    <!-- Diagonal corner accents -->
    <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-blue-500" />
    <div class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-blue-500" />
    <div class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-blue-500" />
    <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-blue-500" />
    
    <div class="text-center">
      <!-- Score with glow effect -->
      <div class="relative">
        <div class="absolute inset-0 text-blue-500 blur-sm">{$fomoStore.currentScore}</div>
        <div class="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-blue-300 to-blue-600">
          {$fomoStore.currentScore}
        </div>
      </div>
      
      <!-- Label with horizontal lines -->
      <div class="mt-4 flex items-center gap-4">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div class="text-blue-400 font-medium tracking-widest text-sm">FOMO LEVEL</div>
        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
    </div>
  </div>
</div>