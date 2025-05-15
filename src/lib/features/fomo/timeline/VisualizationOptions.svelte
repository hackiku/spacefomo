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
    class="inline-flex h-10 items-center rounded-default border border-border bg-muted p-1"
  >
    <ToggleGroup.Item
      value="bar"
      aria-label="Bar chart view"
      class="inline-flex h-8 w-8 items-center justify-center rounded-default text-muted-foreground
             data-[state=on]:bg-card data-[state=on]:text-foreground 
             hover:bg-card/70 hover:text-foreground 
             transition-colors"
    >
      <ChartBar class="h-4 w-4" />
    </ToggleGroup.Item>
    
    <ToggleGroup.Item
      value="line"
      aria-label="Line chart view"
      class="inline-flex h-8 w-8 items-center justify-center rounded-default text-muted-foreground
             data-[state=on]:bg-card data-[state=on]:text-foreground 
             hover:bg-card/70 hover:text-foreground 
             transition-colors"
    >
      <ChartLine class="h-4 w-4" />
    </ToggleGroup.Item>
    
    <ToggleGroup.Item
      value="heatmap"
      aria-label="Heatmap view"
      class="inline-flex h-8 w-8 items-center justify-center rounded-default text-muted-foreground
             data-[state=on]:bg-card data-[state=on]:text-foreground 
             hover:bg-card/70 hover:text-foreground 
             transition-colors"
    >
      <SquaresFour class="h-4 w-4" />
    </ToggleGroup.Item>
  </ToggleGroup.Root>
</div>