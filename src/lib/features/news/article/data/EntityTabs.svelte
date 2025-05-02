<!-- src/lib/features/news/article/data/EntityTabs.svelte -->
<script lang="ts">
  import type { NewsItem } from '$lib/types/news';
  import EntitySection from './EntitySection.svelte';
  import TimelineSection from './TimelineSection.svelte';
  
  let { entities, context } = $props<{
    entities: NewsItem['entities'];
    context: NewsItem['context'];
  }>();
  
  // Define available tabs based on data
  let tabs = $derived(() => {
    const available = [];
    
    if (entities?.companies?.length || entities?.people?.length) {
      available.push({ id: 'entities', label: 'Key Entities' });
    }
    
    if (entities?.technologies?.length) {
      available.push({ id: 'technologies', label: 'Technologies' });
    }
    
    if (context?.timeline) {
      available.push({ id: 'timeline', label: 'Timeline' });
    }
    
    return available;
  });
  
  // Active tab state
  let activeTab = $state(tabs[0]?.id || 'entities');
  
  // Update active tab if current one becomes unavailable
  $effect(() => {
    if (tabs.length > 0 && !tabs.some(tab => tab.id === activeTab)) {
      activeTab = tabs[0].id;
    }
  });
</script>

{#if tabs.length > 0}
  <div class="space-y-4">
    <!-- Tab navigation -->
    <div class="flex space-x-1 border-b border-zinc-800/50 pb-2">
      {#each tabs as tab}
        <button
          class="px-4 py-2 text-sm rounded-t-lg transition-colors relative
                 {activeTab === tab.id 
                   ? 'text-zinc-100 font-medium' 
                   : 'text-zinc-500 hover:text-zinc-300'}"
          on:click={() => activeTab = tab.id}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.label}
          
          {#if activeTab === tab.id}
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"></div>
          {/if}
        </button>
      {/each}
    </div>
    
    <!-- Tab content -->
    <div class="min-h-[200px]">
      {#if activeTab === 'entities' && (entities?.companies?.length || entities?.people?.length)}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#if entities?.companies?.length}
            <EntitySection 
              title="Organizations" 
              items={entities.companies} 
              nameKey="name" 
              detailKey="role" 
            />
          {/if}
          
          {#if entities?.people?.length}
            <EntitySection 
              title="Key People" 
              items={entities.people} 
              nameKey="name" 
              detailKey="role" 
            />
          {/if}
        </div>
      {:else if activeTab === 'technologies' && entities?.technologies?.length}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EntitySection 
            title="Technologies" 
            items={entities.technologies} 
            nameKey="name" 
            detailKey="status" 
          />
          
          {#if entities?.facilities?.length}
            <EntitySection 
              title="Facilities" 
              items={entities.facilities} 
              nameKey="name" 
              detailKey="type" 
            />
          {/if}
        </div>
      {:else if activeTab === 'timeline' && context?.timeline}
        <TimelineSection timeline={context.timeline} />
      {/if}
    </div>
  </div>
{/if}