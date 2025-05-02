<!-- src/lib/features/news/layout/MainLayout.svelte -->
<script lang="ts">
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import Sidebar from './Sidebar.svelte';
  import NewsGrid from './NewsGrid.svelte';
  // import ContextPanel from './ContextPanel.svelte';
  // import FomoTimeline from '../../fomo/timeline/FomoTimeline.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  
  let { 
    sidebarMode = 'default',
    columnCount = 2,
    rightPanelOpen = true
  } = $props<{
    sidebarMode?: SidebarMode;
    columnCount?: ColumnCount;
    rightPanelOpen?: boolean;
  }>();
  
  // Derived values for pane sizing
  const leftPaneSize = $derived(sidebarMode === 'thin' ? 15 : 20);
  const rightPaneSize = $derived(rightPanelOpen ? 25 : 0);
  const centerPaneSize = $derived(100 - leftPaneSize - (rightPanelOpen ? rightPaneSize : 0));
  
  // Handle sidebar mode changes
  function handleSidebarModeChange(mode: SidebarMode) {
    sidebarMode = mode;
  }
  
  // Handle column count changes
  function handleColumnCountChange(count: ColumnCount) {
    columnCount = count;
  }
  
  // Toggle right panel
  function toggleRightPanel() {
    rightPanelOpen = !rightPanelOpen;
  }
</script>

<div class="w-full h-full">
  <PaneGroup direction="horizontal" class="h-[calc(100vh-5rem)]">
    <!-- Left Sidebar -->
    <Pane defaultSize={leftPaneSize} minSize={15} maxSize={30} order={1} class="__bg-zinc-900 border-r border-zinc-800/50">
      <div class="h-full p-4 overflow-auto">
        <Sidebar 
          sidebarMode={sidebarMode}
          columnCount={columnCount}
          compact={sidebarMode === 'thin'}
          onSidebarModeChange={handleSidebarModeChange}
          onColumnCountChange={handleColumnCountChange}
        />
      </div>
    </Pane>
    
    <PaneResizer />
    
    <!-- Main Content -->
    <Pane defaultSize={centerPaneSize} minSize={40} order={2} class="____bg-zinc-900/80">
      <div class="h-full p-6 overflow-auto">
        <NewsGrid columnCount={columnCount} />
      </div>
    </Pane>
    
    {#if rightPanelOpen}
      <PaneResizer />
      
      <!-- Right Information Panel -->
      <Pane defaultSize={rightPaneSize} minSize={20} maxSize={40} order={3} class="bg-zinc-900 border-l border-zinc-800/50">
        <!-- <ContextPanel onClose={toggleRightPanel} /> -->

				<div class="__bg-neutral-950 rounded-2xl">
				</div>
      </Pane>
    {/if}
  </PaneGroup>
  
  <!-- Bottom Timeline Area -->
  <!-- <FomoTimeline /> -->
</div>