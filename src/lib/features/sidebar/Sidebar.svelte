<!-- src/lib/features/sidebar/Sidebar.svelte -->
<script lang="ts">
  import Controls from './controls/Controls.svelte';
  import type { SidebarMode, CardWidth, ColumnCount } from '$lib/types/layout';

  let { 
    sidebarMode, cardWidth, columnCount, compact,
    onSidebarModeChange, onCardWidthChange, onColumnCountChange
  } = $props<{
    sidebarMode: SidebarMode;
    cardWidth: CardWidth;
    columnCount: ColumnCount;
    compact: boolean;
    onSidebarModeChange: (mode: SidebarMode) => void;
    onCardWidthChange: (width: CardWidth) => void;
    onColumnCountChange: (count: ColumnCount) => void;
  }>();
</script>

<div class="flex flex-col gap-6 py-4 w-full">
  <!-- Controls Section -->
  <Controls 
    {sidebarMode}
    {cardWidth}
    {columnCount}
    {compact}
    onSidebarModeChange={onSidebarModeChange}
    onCardWidthChange={onCardWidthChange}
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