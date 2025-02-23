<!-- src/lib/features/fomo/Fomo.svelte -->
<script lang="ts">
  import Controls from './Controls.svelte';
  import Timeline from './timeline/Timeline.svelte';
  
  let { showControls = true } = $props<{
    showControls?: boolean;
  }>();
</script>

<div class="space-y-6">
  {#if showControls}
    <div class="sticky top-0 z-10 -mx-4 bg-black/80 backdrop-blur-sm px-4 py-4 
                sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
      <Controls />
    </div>
  {/if}

  <div class="h-[calc(100vh-6rem)]">
    <Timeline />
  </div>
</div>