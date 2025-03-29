<!-- src/lib/features/sidebar/Sidebar.svelte -->
<script lang="ts">
  import Controls from './controls/Controls.svelte';
  import FilterControls from './controls/FilterControls.svelte';
  import type { SidebarMode, CardWidth, ColumnCount } from '$lib/types/layout';

  let { 
    sidebarMode = $bindable<SidebarMode>('default'),
    cardWidth = $bindable<CardWidth>('normal'),
    columnCount = $bindable<ColumnCount>(1)
  } = $props();
  
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

<div class="flex flex-col gap-8 py-4 overflow-hidden">
  <!-- Controls Section -->
  <Controls 
    bind:sidebarMode 
    bind:cardWidth 
    bind:columnCount 
  />

  <!-- Filter options -->
  <div class="space-y-4 max-w-50">
    <h3 class="text-base font-medium text-zinc-300">Filters</h3>
    <FilterControls 
      bind:fomoThreshold
      bind:selectedTags
      bind:showOnlyActive
    />
  </div>
</div>