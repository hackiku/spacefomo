<!-- src/lib/features/news/layout/SidebarToggle.svelte -->
<script lang="ts">
  import { Button } from "bits-ui";
  import Sidebar from './Sidebar.svelte';
  import type { SidebarMode, ColumnCount } from '$lib/types/layout';
  import { X, List } from 'phosphor-svelte';

  // Props for sidebar configuration
  let { 
    sidebarMode = $bindable<SidebarMode>('default'),
    columnCount = $bindable<ColumnCount>(2)
  } = $props();

  // State for sidebar visibility
  let isExpanded = $state(false);
  
  // Toggle sidebar visibility
  function toggleSidebar() {
    isExpanded = !isExpanded;
  }
</script>

<!-- Single container that expands -->
<div 
  class="fixed left-4 top-24 sm:top-20 z-40
         bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg
         overflow-hidden transition-all duration-300 ease-out
         {isExpanded ? 'w-64 max-h-[80vh]' : 'w-11 h-11'}"
>
  <!-- Button always in the corner -->
  <Button.Root
    onclick={toggleSidebar}
    class="absolute top-0 left-0 w-11 h-11 rounded-lg flex items-center justify-center 
           text-zinc-300 hover:text-zinc-100 transition-colors z-10"
    aria-label={isExpanded ? "Close sidebar" : "Open sidebar"}
    aria-expanded={isExpanded}
  >
    {#if isExpanded}
      <X weight="bold" size={20} />
    {:else}
      <List weight="bold" size={20} />
    {/if}
  </Button.Root>
  
  <!-- Content is always loaded but only visible when expanded -->
  <div class="p-4 pt-14 w-64 opacity-0 {isExpanded ? 'opacity-100' : 'pointer-events-none'} transition-opacity duration-300">
    <Sidebar
      sidebarMode={sidebarMode}
      columnCount={columnCount}
      compact={false}
      onSidebarModeChange={(mode) => sidebarMode = mode}
      onColumnCountChange={(count) => columnCount = count}
    />
  </div>
</div>

<!-- Backdrop when sidebar is open (mobile only) -->
{#if isExpanded}
  <div 
    class="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm sm:hidden transition-opacity duration-300"
    onclick={toggleSidebar}
  ></div>
{/if}

<style>
  /* Any additional styles needed */
</style>