<!-- src/routes/events/EventDetail.svelte -->
<script>
  // Use $props for component props
  let { event, sources, primarySource } = $props();
  
  function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Derived values
  const sourceCount = $derived(sources?.length || 0);
  const tags = $derived(Array.isArray(event?.tags) ? event.tags : []);
</script>

<div>
  <!-- Header -->
  <div class="mb-12">
    <div class="flex items-center gap-2 mb-2">
      <a href="/events" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to Events
      </a>
    </div>
    
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-medium text-foreground mb-2">{event?.title}</h1>
        
        <!-- Event metadata -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div class="flex items-center gap-1">
            <span class="text-lg font-medium">{event?.fomo_score}</span>
            <span>FOMO</span>
          </div>
          
          {#if event?.impact_score}
            <div class="flex items-center gap-1">
              <span class="text-lg font-medium">{event.impact_score}</span>
              <span>Impact</span>
            </div>
          {/if}
          
          {#if event?.event_date}
            <div>{formatDate(event.event_date)}</div>
          {/if}
          
          <div>{sourceCount} sources</div>
        </div>
      </div>
    </div>
    
    <!-- Summary -->
    {#if event?.summary}
      <div class="p-6 border border-border bg-card rounded-lg mb-8">
        <p class="text-lg">{event.summary}</p>
      </div>
    {/if}
    
    <!-- Tags -->
    {#if tags.length > 0}
      <div class="flex flex-wrap gap-2 mb-8">
        {#each tags as tag}
          <span class="px-3 py-1 bg-muted border border-border text-sm text-muted-foreground rounded-full">
            #{tag}
          </span>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Sources section -->
  {#if sources && sources.length > 0}
    <div class="mb-12">
      <h2 class="text-2xl font-medium mb-6">News Sources</h2>
      
      <div class="grid grid-cols-1 gap-6">
        {#each sources as source}
          <div class={`p-6 rounded-lg border ${source.is_primary ? 'border-primary/30 bg-primary/5' : 'border-border bg-card/50'}`}>
            <!-- Source header -->
            <div class="flex flex-wrap justify-between items-start mb-4">
              <div class="mb-2 md:mb-0">
                <h3 class="text-xl font-medium mb-1">{source.title}</h3>
                <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{source.source}</span>
                  {#if source.publication_date}
                    <span class="hidden md:inline">•</span>
                    <span>{formatDate(source.publication_date)}</span>
                  {/if}
                  {#if source.is_primary}
                    <span class="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                      Primary Source
                    </span>
                  {/if}
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">FOMO {source.fomo_score}</span>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center w-8 h-8 bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Visit source website"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </div>
            
            <!-- Source summary -->
            {#if source.summary}
              <p class="mb-4 text-muted-foreground">{source.summary}</p>
            {/if}
            
            <!-- Source tags -->
            {#if source.tags && source.tags.length > 0}
              <div class="flex flex-wrap gap-1.5">
                {#each source.tags.slice(0, 5) as tag}
                  <span class="px-2 py-0.5 bg-muted text-xs text-muted-foreground/70 border border-border/50">
                    #{tag}
                  </span>
                {/each}
                {#if source.tags.length > 5}
                  <span class="px-2 py-0.5 bg-muted text-xs text-muted-foreground/70 border border-border/50">
                    +{source.tags.length - 5}
                  </span>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>