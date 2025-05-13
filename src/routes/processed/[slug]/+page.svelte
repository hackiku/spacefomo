<!-- src/routes/events/[slug]/+page.svelte -->
<script>
  let { data } = $props();
  const { event, sources, primarySource, sourceCount } = data;
  
  function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>{event.title} | SpaceFomo Events</title>
  <meta name="description" content={event.summary || `Space event with ${sourceCount} related news sources`} />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
  <!-- Header -->
  <div class="mb-12">
    <div class="flex items-center gap-2 mb-2">
      <a href="/events" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to Events
      </a>
    </div>
    
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-medium text-foreground mb-2">{event.title}</h1>
        
        <!-- Event metadata -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div class="flex items-center gap-1">
            <span class="text-lg font-medium">{event.fomo_score}</span>
            <span>FOMO</span>
          </div>
          
          {#if event.impact_score}
            <div class="flex items-center gap-1">
              <span class="text-lg font-medium">{event.impact_score}</span>
              <span>Impact</span>
            </div>
          {/if}
          
          {#if event.event_date}
            <div>{formatDate(event.event_date)}</div>
          {/if}
          
          <div>{sourceCount} sources</div>
        </div>
      </div>
    </div>
    
    <!-- Summary -->
    {#if event.summary}
      <div class="p-6 border border-border bg-card rounded-lg mb-8">
        <p class="text-lg">{event.summary}</p>
      </div>
    {/if}
    
    <!-- Tags -->
    {#if event.tags && event.tags.length > 0}
      <div class="flex flex-wrap gap-2 mb-8">
        {#each event.tags as tag}
          <span class="px-3 py-1 bg-muted border border-border text-sm text-muted-foreground rounded-full">
            #{tag}
          </span>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Sources section -->
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
  
  <!-- Context / research section -->
  {#if event.context && Object.keys(event.context).length > 0}
    <div class="mb-12">
      <h2 class="text-2xl font-medium mb-6">Additional Context</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Timeline -->
        {#if event.context.timeline}
          <div class="p-6 border border-border bg-card/50 rounded-lg">
            <h3 class="text-xl font-medium mb-4">Timeline</h3>
            <pre class="text-sm text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(event.context.timeline, null, 2)}
            </pre>
          </div>
        {/if}
        
        <!-- Market data -->
        {#if event.context.market_data}
          <div class="p-6 border border-border bg-card/50 rounded-lg">
            <h3 class="text-xl font-medium mb-4">Market Data</h3>
            <pre class="text-sm text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(event.context.market_data, null, 2)}
            </pre>
          </div>
        {/if}
        
        <!-- Narrative -->
        {#if event.context.narrative_thread}
          <div class="p-6 border border-border bg-card/50 rounded-lg">
            <h3 class="text-xl font-medium mb-4">Narrative Analysis</h3>
            <pre class="text-sm text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(event.context.narrative_thread, null, 2)}
            </pre>
          </div>
        {/if}
        
        <!-- Research metadata -->
        {#if event.context.related_research}
          <div class="p-6 border border-border bg-card/50 rounded-lg">
            <h3 class="text-xl font-medium mb-4">Research Metadata</h3>
            <pre class="text-sm text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(event.context.related_research, null, 2)}
            </pre>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- Entities section -->
  {#if event.entities && Object.keys(event.entities).length > 0}
    <div>
      <h2 class="text-2xl font-medium mb-6">Key Entities</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Companies -->
        {#if event.entities.companies && event.entities.companies.length > 0}
          <div class="p-6 border border-border bg-card/50 rounded-lg">
            <h3 class="text-xl font-medium mb-4">Companies</h3>
            <ul class="space-y-3">
              {#each event.entities.companies as company}
                <li>
                  <div class="font-medium">{company.name}</div>
                  {#if company.role}
                    <div class="text-sm text-muted-foreground">{company.role}</div>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
        
        <!-- People -->
        {#if event.entities.people && event.entities.people.length > 0}
          <div class="p-6 border border-border bg-card/50 rounded-lg">
            <h3 class="text-xl font-medium mb-4">People</h3>
            <ul class="space-y-3">
              {#each event.entities.people as person}
                <li>
                  <div class="font-medium">{person.name}</div>
                  {#if person.role || person.company}
                    <div class="text-sm text-muted-foreground">
                      {#if person.role && person.company}
                        {person.role} at {person.company}
                      {:else if person.role}
                        {person.role}
                      {:else if person.company}
                        {person.company}
                      {/if}
                    </div>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
        
        <!-- Technologies -->
        {#if event.entities.technologies && event.entities.technologies.length > 0}
          <div class="p-6 border border-border bg-card/50 rounded-lg">
            <h3 class="text-xl font-medium mb-4">Technologies</h3>
            <ul class="space-y-3">
              {#each event.entities.technologies as tech}
                <li>
                  <div class="font-medium">{tech.name}</div>
                  {#if tech.status}
                    <div class="text-sm text-muted-foreground">{tech.status}</div>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>