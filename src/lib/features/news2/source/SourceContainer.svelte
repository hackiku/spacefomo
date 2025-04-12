<!-- src/lib/features/news/source/SourceContainer.svelte -->
<script lang="ts">
  import Sources from './Sources.svelte';
  import TitleUrl from './TitleUrl.svelte';
  
  let { article } = $props<{
    article: {
      title: string;
      source: string | null;
      url: string;
      publication_date: Date | null;
      read_time: number | null;
    };
  }>();
  
  let copied = $state(false);
  
  function copyUrl() {
    if (article?.url) {
      navigator.clipboard.writeText(article.url);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    }
  }
</script>

<div class="space-y-3">
  <!-- Source with date and read time -->
  <Sources 
    source={{ name: article.source || 'Unknown source', id: 1 }}
    publicationDate={article.publication_date}
    readTime={article.read_time}
  />
  
  <!-- Title and URL -->
  <TitleUrl 
    title={article.title}
    url={article.url}
    {copied}
    onCopyUrl={copyUrl}
  />
</div>