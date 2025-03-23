<!-- src/lib/features/sidebar/Sidebar.svelte -->
<script lang="ts">
  import Controls from './controls/Controls.svelte';
  import FilterControls from './controls/FilterControls.svelte';
  import FomoCardContainer from '$lib/features/fomo/FomoCardContainer.svelte';
  import type { LayoutOption } from '$lib/types/layout';

  // Props with bindable values for layout settings
  let { 
    activeLayout = $bindable<LayoutOption['name']>('normal'),
    columnCount = $bindable(2)
  } = $props<{
    activeLayout?: LayoutOption['name'];
    columnCount?: number;
  }>();
  
  // Local filter state
  let fomoThreshold = $state(0);
  let selectedTags = $state<string[]>([]);
  let showOnlyActive = $state(false);
  
  // Effect to handle filter changes
  $effect(() => {
    console.log('Filters updated:', { fomoThreshold, selectedTags, showOnlyActive });
    // Implement filter logic here
  });
</script>

<div class="flex flex-col gap-12">
  <!-- Controls Section -->
  <Controls bind:activeLayout bind:columnCount />

  <!-- FOMO Card Container -->
  <FomoCardContainer />

  <!-- Filter options -->
  <div class="space-y-4">
    <h3 class="text-base font-medium text-zinc-300">Filters</h3>
    <FilterControls 
      bind:fomoThreshold
      bind:selectedTags
      bind:showOnlyActive
    />
  </div>
</div>