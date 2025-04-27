<!-- src/lib/features/news/layout/MobileSidebar.svelte -->
<script lang="ts">
  import { X, Sliders } from 'phosphor-svelte';
  import LayoutControls from '../controls/LayoutControls.svelte';
  import FilterControls from '../controls/FilterControls.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  
  let { 
    isOpen = false,
    sidebarMode,
    columnCount,
    onClose,
    onSidebarModeChange,
    onColumnCountChange
  } = $props<{
    isOpen: boolean;
    sidebarMode: SidebarMode;
    columnCount: ColumnCount;
    onClose: () => void;
    onSidebarModeChange: (mode: SidebarMode) => void;
    onColumnCountChange: (count: ColumnCount) => void;
  }>();
  
  // Filter values with defaults
  let fomoScore = $state(50);
  let selectedTags = $state<string[]>([]);
  let activeOnly = $state(false);
  
  // Handle filter changes
  function handleFomoChange(value: number) {
    fomoScore = value;
  }
  
  function handleTagsChange(tags: string[]) {
    selectedTags = tags;
  }
  
  function handleActiveChange(active: boolean) {
    activeOnly = active;
  }
</script>

<!-- Mobile sidebar overlay -->
{#if isOpen}
  <div class="fixed inset-0 z-50 flex md:hidden">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black/40 backdrop-blur-sm"
      on:click={onClose}
      aria-hidden="true"
    ></div>
    
    <!-- Sidebar content -->
    <div class="relative w-4/5 max-w-xs bg-zinc-900 h-full border-r border-zinc-800 overflow-y-auto">
      <div class="p-4">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-zinc-200">Settings</h2>
          <button 
            type="button"
            class="p-2 rounded-full text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/80"
            on:click={onClose}
            aria-label="Close settings"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Layout controls -->
        <div class="py-4 border-b border-zinc-800">
          <h3 class="text-sm font-medium text-zinc-300 mb-4">Layout</h3>
          <LayoutControls 
            sidebarMode={sidebarMode}
            columnCount={columnCount}
            compact={false}
            onSidebarModeChange={onSidebarModeChange}
            onColumnCountChange={onColumnCountChange}
          />
        </div>
        
        <!-- Filters -->
        <div class="py-4">
          <h3 class="text-sm font-medium text-zinc-300 mb-4">Filters</h3>
          <FilterControls 
            fomoThreshold={fomoScore}
            selectedTags={selectedTags}
            showOnlyActive={activeOnly}
            onFomoThresholdChange={handleFomoChange}
            onSelectedTagsChange={handleTagsChange}
            onShowOnlyActiveChange={handleActiveChange}
          />
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Mobile Toggle Button -->
<button
  type="button"
  class="fixed bottom-20 right-4 md:hidden z-40 w-12 h-12 rounded-full 
         bg-zinc-800/90 border border-zinc-700/60 backdrop-blur-sm
         text-zinc-300 flex items-center justify-center shadow-lg"
  on:click={() => isOpen = !isOpen}
  aria-label={isOpen ? "Close settings" : "Open settings"}
  aria-expanded={isOpen}
>
  <Sliders class="w-5 h-5" />
</button>