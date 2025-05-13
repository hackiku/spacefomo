<!-- src/routes/admin/process/RawNewsQueue.svelte -->
<script lang="ts">
  import { ArrowRight, MagnifyingGlass, FunnelSimple, Pulse, Clock, Globe } from 'phosphor-svelte';
  
  // Props
  let { onSelect } = $props<{
    onSelect: (article: any) => void
  }>();
  
  // Mock data for raw_news table items
  const mockRawNews = [
    {
      id: "0cf7c618-9c7e-47df-aeaa-7f6b36a6c46e",
      url: "https://orbitaltoday.com/2025/05/10/interlune-just-unveiled-a-lunar-excavator-to-kickstart-helium-3-mining/",
      title: "Interlune Just Unveiled a Lunar Excavator to Kickstart Helium-3 Mining",
      publication_date: "2025-05-10",
      source_name: "Orbital Today",
      source_type: "agent_research",
      discovered_at: "2025-05-13T18:39:17.890Z",
      status: "pending"
    },
    {
      id: "24a1ef6e-c074-4bba-89ed-2450749c2be5",
      url: "https://www.techeblog.com/bridgestone-new-lunar-rover-tire-prototypes-jaxa/",
      title: "Bridgestone's Two New Lunar Rover Tire Prototypes Use Thin Metal Spokes",
      publication_date: "2025-04-07",
      source_name: "Techeblog",
      source_type: "agent_research",
      discovered_at: "2025-05-13T20:00:28.984Z",
      status: "pending"
    },
    {
      id: "3945df80-a69c-4bbf-83ae-91084b4a9dd0",
      url: "https://interestingengineering.com/space/halospace-aurora-balloon-tourism",
      title: null,
      publication_date: null,
      source_name: "interestingengineering.com",
      source_type: "submission",
      discovered_at: "2025-05-13T17:29:47.708Z",
      status: "pending"
    },
    {
      id: "4069537e-05ff-48b7-8c85-e82a0c4b71e5",
      url: "https://orbitaltoday.com/2025/05/13/space-law-is-stuck-in-the-60s-we-can-mine-the-moon-but-we-cant-protect-it/",
      title: "Space Law Is Stuck in the '60s: We Can Mine the Moon, But We Can't Protect It",
      publication_date: "2025-05-13",
      source_name: "Orbital Today",
      source_type: "agent_research",
      discovered_at: "2025-05-13T18:39:17.883Z",
      status: "pending"
    }
  ];
  
  // State
  let rawNews = $state(mockRawNews);
  let searchQuery = $state('');
  let filterType = $state('all');
  let sortBy = $state('newest');
  
  // Derived values
  let filteredNews = $derived(() => {
    let filtered = [...rawNews];
    
    // Apply source type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.source_type === filterType);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.title?.toLowerCase().includes(query)) || 
        item.url.toLowerCase().includes(query) || 
        item.source_name?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.discovered_at).getTime() - new Date(a.discovered_at).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.discovered_at).getTime() - new Date(b.discovered_at).getTime());
    }
    
    return filtered;
  });
  
  // Format relative time
  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  }
  
  // Format source type
  function getSourceLabel(type: string) {
    switch(type) {
      case 'agent_research': return 'AI Research';
      case 'submission': return 'User Submission';
      default: return type;
    }
  }
  
  // Format source type badge color
  function getSourceTypeColor(type: string) {
    switch(type) {
      case 'agent_research': 
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'submission': 
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      default: 
        return 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30';
    }
  }
</script>

<div class="rounded-default border border-border bg-card/60 backdrop-blur-sm">
  <div class="p-5 border-b border-border flex flex-wrap items-center justify-between gap-4">
    <h2 class="text-lg font-medium text-foreground">Raw News Queue</h2>
    
    <div class="flex items-center gap-3">
      <!-- Sort Options -->
      <div class="relative">
        <select 
          bind:value={sortBy}
          class="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-muted border border-border 
                 text-sm text-muted-foreground focus:text-foreground
                 focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <div class="absolute right-2 top-2 pointer-events-none text-muted-foreground">
          <FunnelSimple weight="bold" class="h-4 w-4" />
        </div>
      </div>
    </div>
  </div>
  
  <div class="p-4 border-b border-border grid grid-cols-1 md:grid-cols-5 gap-4">
    <!-- Search -->
    <div class="md:col-span-3">
      <div class="relative">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by title, URL or source..."
          class="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border
                 text-foreground placeholder:text-muted-foreground
                 focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <MagnifyingGlass class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>
    </div>
    
    <!-- Source Type Filter -->
    <div class="md:col-span-2">
      <div class="flex rounded-lg border border-border overflow-hidden">
        <button
          onclick={() => filterType = 'all'}
          class={`flex-1 py-2 text-sm transition-colors
                 ${filterType === 'all' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          All Sources
        </button>
        <button
          onclick={() => filterType = 'agent_research'}
          class={`flex-1 py-2 text-sm transition-colors
                 ${filterType === 'agent_research' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          AI Research
        </button>
        <button
          onclick={() => filterType = 'submission'}
          class={`flex-1 py-2 text-sm transition-colors
                 ${filterType === 'submission' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Submissions
        </button>
      </div>
    </div>
  </div>
  
  <div class="overflow-y-auto max-h-[60vh]">
    {#if filteredNews.length === 0}
      <div class="p-8 text-center">
        <Pulse weight="duotone" class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p class="text-muted-foreground">No articles found.</p>
        <p class="text-sm text-muted-foreground/80 mt-1">Try adjusting your filters or search query.</p>
      </div>
    {:else}
      <ul class="divide-y divide-border">
        {#each filteredNews as article}
          <li class="group hover:bg-muted/30 transition-colors">
            <div class="p-4 flex items-start justify-between">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <!-- Source Type Badge -->
                  <span class={`px-2 py-0.5 text-xs rounded-full border ${getSourceTypeColor(article.source_type)}`}>
                    {getSourceLabel(article.source_type)}
                  </span>
                  
                  <!-- Source Name -->
                  {#if article.source_name}
                    <span class="text-sm text-muted-foreground">
                      {article.source_name}
                    </span>
                  {/if}
                  
                  <!-- Publication Date -->
                  {#if article.publication_date}
                    <span class="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock weight="fill" class="h-3 w-3" />
                      {article.publication_date}
                    </span>
                  {/if}
                </div>
                
                <!-- Title -->
                <h3 class="font-medium text-foreground line-clamp-1 mb-1">
                  {article.title || 'Untitled Article'}
                </h3>
                
                <!-- URL -->
                <div class="flex items-center gap-1.5 text-sm text-primary/80 hover:text-primary">
                  <Globe weight="fill" class="h-3.5 w-3.5" />
                  <a href={article.url} target="_blank" rel="noopener noreferrer" class="line-clamp-1 hover:underline">
                    {article.url}
                  </a>
                </div>
                
                <!-- Discovery Date -->
                <div class="mt-2 text-xs text-muted-foreground">
                  Added {formatRelativeTime(article.discovered_at)}
                </div>
              </div>
              
              <button
                onclick={() => onSelect(article)}
                class="ml-4 flex-shrink-0 p-2 rounded-lg bg-primary/10 hover:bg-primary/20
                       text-primary hover:text-primary transition-colors group-hover:scale-105 transform duration-200"
                aria-label="Process this article"
              >
                <ArrowRight weight="bold" class="h-5 w-5" />
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  <!-- Pagination or Stats -->
  <div class="p-4 border-t border-border flex justify-between items-center">
    <span class="text-sm text-muted-foreground">
      {filteredNews.length} of {rawNews.length} articles
    </span>
    
    <div class="flex gap-2">
      <button class="px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors">
        Process Selected
      </button>
      
      <button class="px-3 py-1.5 rounded-lg bg-primary/10 text-sm text-primary hover:bg-primary/20 transition-colors">
        Process All
      </button>
    </div>
  </div>
</div>