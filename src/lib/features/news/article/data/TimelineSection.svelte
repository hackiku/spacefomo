<!-- src/lib/features/news/article/data/TimelineSection.svelte -->
<script lang="ts">
  let { timeline } = $props<{
    timeline: Record<string, any>;
  }>();
  
  // Get all date fields from the timeline
  const dateFields = $derived(() => {
    const fields = [];
    
    if (timeline.target_date) fields.push({ 
      label: 'Target', 
      value: timeline.target_date, 
      type: 'future'
    });
    
    if (timeline.current_date) fields.push({ 
      label: 'Current', 
      value: timeline.current_date,
      type: 'present'
    });
    
    if (timeline.official_date) fields.push({ 
      label: 'Official', 
      value: timeline.official_date,
      type: timeline.official_date > timeline.current_date ? 'future' : 'past'
    });
    
    return fields;
  });
</script>

<div class="rounded-xl bg-zinc-800/20 border border-zinc-700/30 p-5">
  {#if timeline.phase}
    <div class="mb-4 flex items-center space-x-2">
      <div class="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-sm">
        Phase: {timeline.phase}
      </div>
    </div>
  {/if}
  
  {#if dateFields.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      {#each dateFields as field}
        <div class="space-y-1">
          <span class="text-zinc-500 text-xs uppercase tracking-wider">{field.label} Date</span>
          <div class="text-zinc-200 font-medium">
            {field.value}
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if timeline.milestones}
    <div class="mt-4">
      <h4 class="text-sm font-medium text-zinc-400 mb-2">Key Milestones</h4>
      <div class="space-y-2">
        {#each Object.entries(timeline.milestones) as [key, value]}
          <div class="flex justify-between items-baseline">
            <span class="text-zinc-300">{key.replace(/_/g, ' ')}</span>
            <span class="text-zinc-400">{value}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>