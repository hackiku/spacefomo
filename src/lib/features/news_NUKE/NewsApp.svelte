<!-- src/lib/features/news/NewsApp.svelte -->

<!-- main container for news app -->


<script lang="ts">
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import { useNews } from '$lib/hooks';
  import type { NewsItem } from '$lib/types/news';
  
  // Core components
  import NewsFeed from './feed/NewsFeed.svelte';
  import ControlsSidebar from './sidebar/ControlsSidebar.svelte';
  import DetailsSidebar from './sidebar/DetailsSidebar.svelte';
  import NewsReader from './reader/NewsReader.svelte';
  
  // State
  let selectedArticle = $state<NewsItem | null>(null);
  let leftSidebarCollapsed = $state(false); 
  let rightSidebarCollapsed = $state(false);
  
  // Use the news hook to get data
  const { items, isLoading, error } = useNews();
  
  // Layout configuration
  let leftPaneSize = $state(leftSidebarCollapsed ? 0 : 20);
  let centerPaneSize = $state(100 - leftPaneSize - (rightSidebarCollapsed ? 0 : 30));
  let rightPaneSize = $state(rightSidebarCollapsed ? 0 : 30);
  
  // Handlers
  function handleArticleSelect(article: NewsItem) {
    selectedArticle = article;
  }
  
  function toggleLeftSidebar() {
    leftSidebarCollapsed = !leftSidebarCollapsed;
    updatePaneSizes();
  }
  
  function toggleRightSidebar() {
    rightSidebarCollapsed = !rightSidebarCollapsed;
    updatePaneSizes();
  }
  
  // Update pane sizes based on sidebar states
  function updatePaneSizes() {
    leftPaneSize = leftSidebarCollapsed ? 0 : 20;
    rightPaneSize = rightSidebarCollapsed ? 0 : 30;
    centerPaneSize = 100 - leftPaneSize - rightPaneSize;
  }
  
  // When the selected article changes, ensure the right sidebar is visible
  $effect(() => {
    if (selectedArticle && rightSidebarCollapsed) {
      rightSidebarCollapsed = false;
      updatePaneSizes();
    }
  });
</script>

<div class="h-full min-h-[calc(100vh-6rem)]">
  <PaneGroup direction="horizontal">
    <!-- Left Sidebar: Controls -->
    {#if !leftSidebarCollapsed}
      <Pane defaultSize={leftPaneSize} minSize={15} class="border-r border-zinc-800">
        <ControlsSidebar onToggle={toggleLeftSidebar} />
      </Pane>
      <PaneResizer />
    {/if}
    
    <!-- Main Content: News Feed -->
    <Pane defaultSize={centerPaneSize} minSize={30}>
      <div class="flex h-full">
        <!-- Collapse button for left sidebar -->
        {#if leftSidebarCollapsed}
          <button 
            class="absolute left-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-r-lg
                   bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
            onclick={toggleLeftSidebar}
            aria-label="Expand sidebar"
          >
            →
          </button>
        {/if}
        
        <!-- News feed content -->
        <div class="w-full px-4 py-4 overflow-y-auto">
          <NewsFeed 
            {items} 
            {isLoading} 
            {error} 
            selectedArticle={selectedArticle?.id}
            onSelectArticle={handleArticleSelect} 
          />
        </div>
      </div>
    </Pane>
    
    <!-- Right Sidebar: Article Details -->
    {#if !rightSidebarCollapsed}
      <PaneResizer />
      <Pane defaultSize={rightPaneSize} minSize={20} class="border-l border-zinc-800">
        <DetailsSidebar
          article={selectedArticle}
          onToggle={toggleRightSidebar}
        />
      </Pane>
    {:else if selectedArticle}
      <!-- Collapse button for right sidebar -->
      <button 
        class="absolute right-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-l-lg
               bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
        onclick={toggleRightSidebar}
        aria-label="Expand details"
      >
        ←
      </button>
    {/if}
  </PaneGroup>
  
  <!-- Reader Modal -->
  {#if selectedArticle}
    <NewsReader article={selectedArticle} onClose={() => selectedArticle = null} />
  {/if}
</div>