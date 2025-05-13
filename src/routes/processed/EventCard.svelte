<!-- src/routes/events/EventCard.svelte -->
<script>
  // Use $props for component props
  let { event, isTestData = false } = $props();
  
  function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Derived values with $derived
  const fomo = $derived(event?.fomo_score || 0);
  const impact = $derived(event?.impact_score || 0);
  
  // Use $derived for derived state
  const tags = $derived(
    Array.isArray(event?.tags) ? event.tags : []
  );
</script>

<div class="group relative w-full cursor-pointer">
  <div class="rounded-default p-5 border border-border
              bg-card/60 backdrop-blur-sm 
              group-hover:border-venus-yellow/30 group-hover:bg-card
              transition-all duration-200">
  
    <!-- Header with FOMO score and date -->
    <div class="flex items-start gap-3 mb-3">
      <!-- FOMO Score -->
      <span class="fomo-score text-xl font-semibold">
        {fomo}
      </span>

      <!-- Impact Score (if available) -->
      {#if impact > 0}
        <span class="text-xs text-muted-foreground pt-1">
          Impact: {impact}
        </span>
      {/if}

      <!-- Date info -->
      <div class="flex items-center ml-auto">
        {#if event?.event_date}
          <span class="text-lg text-muted-foreground">{formatDate(event.event_date)}</span>
        {/if}
      </div>
    </div>
    
    <!-- Title -->
    <div class="mb-4">
      <h2 class="text-lg font-medium text-foreground line-clamp-2">
        {event?.title}
      </h2>
    </div>

    <!-- Summary -->
    {#if event?.summary}
      <p class="text-sm text-muted-foreground mb-4 line-clamp-2">
        {event.summary}
      </p>
    {/if}

    <!-- Source count badge -->
    <div class="mb-3 flex items-center gap-2">
      <span class="bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        {isTestData ? '1 source' : `${event?.source_count || 0} sources`}
      </span>
      
      {#if !isTestData && event?.primary_source}
        <span class="text-xs text-muted-foreground">Primary: {event.primary_source}</span>
      {/if}
    </div>

    <!-- Tags -->
    {#if tags.length > 0}
      <div class="flex flex-wrap gap-1.5">
        {#each tags.slice(0, 3) as tag}
          <span class="bg-muted border border-border px-2 py-0.5 text-xs text-muted-foreground/70 truncate max-w-[120px]">
            #{tag}
          </span>
        {/each}
        {#if tags.length > 3}
          <span class="bg-muted border border-border px-2 py-0.5 text-xs text-muted-foreground/70">
            +{tags.length - 3}
          </span>
        {/if}
      </div>
    {/if}
  </div>
  
  <!-- External link indicator -->
  <a
    href={`/events/${event?.slug}`}
    class="absolute bottom-5 right-5 flex items-center justify-center h-7 w-7
           bg-muted border border-border text-muted-foreground
           group-hover:text-foreground group-hover:border-venus-yellow/30
           transition-all duration-200 z-10
           before:absolute before:inset-0
           before:border before:border-primary/10
           before:translate-x-0.5 before:translate-y-0.5
           before:transition-transform before:duration-300
           group-hover:before:translate-x-0 group-hover:before:translate-y-0"
    aria-label="View event details"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  </a>
</div>