<!-- src/lib/features/news/source/Sources.svelte -->
<script lang="ts">
  import { Calendar, Clock } from 'phosphor-svelte';
  
  let { source, publicationDate, readTime } = $props<{
    source: { name: string, id: string | number };
    publicationDate: Date | null;
    readTime: number | null;
  }>();

  // Format date in a more readable way
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Example placeholders for other sources
  const placeholders = ['Source 2', 'Source 3'];
</script>

<div class="flex items-center gap-3 mb-4">
  <!-- Active source -->
  <div class="px-4 py-2.5 rounded-full bg-violet-600/30 text-violet-300 border border-violet-700/50">
    {source.name}
  </div>
  
  <!-- Date and read time -->
  <div class="flex-1 flex-col items-center gap-6 pl-3">
    {#if publicationDate}
      <div class="flex items-center gap-1.5 text-sm text-zinc-400">
        <Calendar class="h-4 w-4 text-zinc-500" />
        <span>{formatDate(publicationDate)}</span>
      </div>
    {/if}
    
    {#if readTime}
      <div class="flex items-center gap-1.5 text-sm text-zinc-400">
        <Clock class="h-4 w-4 text-zinc-500" />
        <span>{readTime} min read</span>
      </div>
    {/if}
  </div>
  
  <!-- Placeholder for other sources (inactive) -->
  <div class="flex items-center gap-2">
    {#each placeholders as placeholder}
      <div class="px-3 py-1.5 rounded-full bg-zinc-800/30 text-zinc-500 border border-zinc-700/20 text-sm cursor-not-allowed">
        {placeholder}
      </div>
    {/each}
  </div>
</div>