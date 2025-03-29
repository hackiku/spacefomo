<!-- src/lib/features/sidebar/Sidebar.svelte -->
<script lang="ts">
  import Controls from './controls/Controls.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';

  let { 
    sidebarMode, columnCount, compact,
    onSidebarModeChange, onColumnCountChange
  } = $props<{
    sidebarMode: SidebarMode;
    columnCount: ColumnCount;
    compact: boolean;
    onSidebarModeChange: (mode: SidebarMode) => void;
    onColumnCountChange: (count: ColumnCount) => void;
  }>();
</script>

<div class="flex flex-col gap-6 py-4 w-full">
  <!-- Controls Section -->
  <Controls 
    {sidebarMode}
    {columnCount}
    {compact}
    onSidebarModeChange={onSidebarModeChange}
    onColumnCountChange={onColumnCountChange}
  />

  <!-- We're keeping the filter section commented out for now -->
  <!-- {#if !compact}
    <div class="space-y-4 w-full">
      <h3 class="text-base font-medium text-zinc-300">Filters</h3>
      <FilterControls 
        {fomoThreshold}
        selectedTags={selectedTags}
        {showOnlyActive}
        onFomoThresholdChange={(value) => fomoThreshold = value}
        onSelectedTagsChange={(tags) => selectedTags = tags}
        onShowOnlyActiveChange={(value) => showOnlyActive = value}
      />
    </div>
  {/if} -->
</div>