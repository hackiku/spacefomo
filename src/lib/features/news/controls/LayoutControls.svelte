<!-- src/lib/features/news/controls/LayoutControls.svelte -->
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  import { ArrowsInLineHorizontal, Columns, Table, Rows, SquaresFour } from 'phosphor-svelte';
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

  // Handle layout toggle changes
  function handleLayoutChange(layout: string | string[]) {
    if (typeof layout === 'string') {
      onSidebarModeChange(layout as SidebarMode);
    }
  }

  // Handle column toggle changes
  function handleColumnChange(columns: string | string[]) {
    if (typeof columns === 'string') {
      onColumnCountChange(Number(columns) as ColumnCount);
    }
  }
</script>

<div class="space-y-2 w-full">
  <!-- Layout Toggle Group -->
  <div class="w-fit">
    <ToggleGroup.Root
      type="single"
      value={sidebarMode}
      onValueChange={handleLayoutChange}
      orientation="horizontal"
      class="inline-flex rounded-md bg-zinc-800/30 p-1"
    >
      <ToggleGroup.Item
        value="thin"
        aria-label="Compact view"
        class="data-[state=on]:bg-zinc-800 data-[state=on]:text-zinc-200 
              inline-flex h-9 w-9 items-center justify-center rounded 
              text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-zinc-700"
      >
        <ArrowsInLineHorizontal class="h-5 w-5" />
      </ToggleGroup.Item>
      
      <ToggleGroup.Item
        value="default"
        aria-label="Default layout"
        class="data-[state=on]:bg-zinc-800 data-[state=on]:text-zinc-200 
              inline-flex h-9 w-9 items-center justify-center rounded 
              text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-zinc-700"
      >
        <Columns class="h-5 w-5" />
      </ToggleGroup.Item>
      
      <ToggleGroup.Item
        value="wide"
        aria-label="Wide layout"
        class="data-[state=on]:bg-zinc-800 data-[state=on]:text-zinc-200 
              inline-flex h-9 w-9 items-center justify-center rounded 
              text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-zinc-700"
      >
        <Table class="h-5 w-5" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>

  <!-- Column Toggle Group -->
  <div class="w-fit">
    <ToggleGroup.Root
      type="single"
      value={String(columnCount)}
      onValueChange={handleColumnChange}
      orientation="horizontal"
      class="inline-flex rounded-md bg-zinc-800/30 p-1"
    >
      <ToggleGroup.Item
        value="1"
        aria-label="Single column"
        class="data-[state=on]:bg-zinc-800 data-[state=on]:text-zinc-200 
              inline-flex h-9 w-9 items-center justify-center rounded 
              text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-zinc-700"
      >
        <Rows class="h-5 w-5" />
      </ToggleGroup.Item>
      
      <ToggleGroup.Item
        value="2"
        aria-label="Two columns"
        class="data-[state=on]:bg-zinc-800 data-[state=on]:text-zinc-200 
              inline-flex h-9 w-9 items-center justify-center rounded 
              text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-zinc-700"
      >
        <SquaresFour class="h-5 w-5" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>
</div>