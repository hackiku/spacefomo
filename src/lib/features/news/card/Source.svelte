<!-- src/lib/features/news/card/Source.svelte -->
<script lang="ts">
  let { originalTitle, source, readTime, publicationDate } = $props<{
    originalTitle: string;
    source: string | null;
    readTime: number | null;
    publicationDate: string | Date | null;
  }>();

  const formatDate = (date: string | Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
</script>

<div class="space-y-3">
  <!-- Original title -->
  <p class="text-lg text-zinc-200 leading-relaxed font-medium">
    {originalTitle}
  </p>
  
  <!-- Metadata row -->
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
    {#if source}
      <span>{source}</span>
      {#if readTime || publicationDate}
        <span class="text-zinc-700">•</span>
      {/if}
    {/if}
    
    {#if readTime}
      <span>{readTime} min read</span>
      {#if publicationDate}
        <span class="text-zinc-700">•</span>
      {/if}
    {/if}
    
    {#if publicationDate}
      <span>Published {formatDate(publicationDate)}</span>
    {/if}
  </div>
</div>