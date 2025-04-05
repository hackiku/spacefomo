<!-- src/lib/features/news/source/SourceContainer.svelte -->
<script lang="ts">
  import Sources from './Sources.svelte';
  import TitleUrl from './TitleUrl.svelte';
  
  // Mock data structure for multiple sources
  interface SourceData {
    id: string | number;
    name: string;
    title: string;
    url: string;
    publicationDate: Date | null;
    readTime: number | null;
  }
  
  let { sources } = $props<{
    sources: SourceData[];
  }>();
  
  let activeSourceId = $state(sources[0]?.id || '');
  let copied = $state(false);
  
  // Get active source object
  const activeSource = $derived(sources.find(s => s.id === activeSourceId) || sources[0]);
  
  function copyUrl() {
    if (activeSource?.url) {
      navigator.clipboard.writeText(activeSource.url);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    }
  }
  
  function handleSourceSelect(id: string | number) {
    activeSourceId = id;
    copied = false; // Reset copied state when switching sources
  }
</script>

<div class="space-y-4">
  <!-- Source selector -->
  <Sources 
    sources={sources} 
    activeSource={activeSourceId} 
    onSelectSource={handleSourceSelect} 
  />
  
  <!-- Title URL container -->
  {#if activeSource}
    <TitleUrl 
      title={activeSource.title}
      url={activeSource.url}
      publicationDate={activeSource.publicationDate}
      readTime={activeSource.readTime}
      {copied}
      onCopyUrl={copyUrl}
    />
  {/if}
</div>