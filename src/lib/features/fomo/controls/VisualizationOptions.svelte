<!-- src/lib/features/fomo/controls/VisualizationOptions.svelte -->
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  import { ChartBar, ChartLine, SquaresFour } from 'phosphor-svelte';
  import { createEventDispatcher } from 'svelte';
  
  type VisualizationType = 'bar' | 'line' | 'heatmap';
  
  // Props
  let { activeView = $bindable<VisualizationType>('bar') } = $props();
  
  // Set up event dispatcher
  const dispatch = createEventDispatcher<{
    change: { view: VisualizationType }
  }>();
  
  // When view changes, dispatch an event
  $effect(() => {
    dispatch('change', { view: activeView });
  });
</script>

<div class="visualization-options">
  <ToggleGroup.Root
    type="single"
    bind:value={activeView}
    class="inline-flex h-10 items-center rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-1"
  >
    <ToggleGroup.Item
      value="bar"
      aria-label="Bar chart view"
      class="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400
             data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-200 
             hover:bg-zinc-700/50 hover:text-zinc-300 
             transition-colors"
    >
      <ChartBar class="h-4 w-4" />
    </ToggleGroup.Item>
    
    <ToggleGroup.Item
      value="line"
      aria-label="Line chart view"
      class="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400
             data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-200 
             hover:bg-zinc-700/50 hover:text-zinc-300 
             transition-colors"
    >
      <ChartLine class="h-4 w-4" />
    </ToggleGroup.Item>
    
    <ToggleGroup.Item
      value="heatmap"
      aria-label="Heatmap view"
      class="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400
             data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-200 
             hover:bg-zinc-700/50 hover:text-zinc-300 
             transition-colors"
    >
      <SquaresFour class="h-4 w-4" />
    </ToggleGroup.Item>
  </ToggleGroup.Root>
</div>