<!-- src/lib/features/sidebar/Sidebar.svelte -->
<script lang="ts">
  import { fomoStore } from '$lib/stores/fomoStore';
  import Controls from './controls/Controls.svelte';
  import FilterControls from './controls/FilterControls.svelte';
  import FomoCardContainer from '../fomo/FomoCardContainer.svelte';
  import { writable } from 'svelte/store';
  import type { LayoutOption } from '$lib/types/layout';

  export let activeLayout = $state<LayoutOption['name']>('normal');
  export let columnCount = $state(2);
  
  // Store for filter settings
  export const sidebarSettings = writable({
    fomoThreshold: 0,
    selectedTags: [] as string[],
    showOnlyActive: false
  });
</script>

<div class="sticky top-18 flex flex-col gap-12">
  <!-- Controls Section -->
  <div class="space-y-6">
    <h3 class="text-base font-medium text-zinc-300">Layout</h3>
    <Controls bind:activeLayout bind:columnCount />
  </div>

  <!-- FOMO Card Container -->
  <div class="space-y-4">
    <h3 class="text-base font-medium text-zinc-300">FOMO Score</h3>
    <FomoCardContainer />
  </div>

  <!-- Filter options -->
  <div class="space-y-4">
    <h3 class="text-base font-medium text-zinc-300">Filters</h3>
    <FilterControls settings={sidebarSettings} />
  </div>
</div>