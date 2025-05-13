<!-- src/routes/admin/ArticlePreview.svelte -->
<script lang="ts">
  // import { formatUrl } from '$lib/utils/formatUrl';
  import { Globe, Clock, ArrowSquareOut } from 'phosphor-svelte';
  
  let { article } = $props<{
    article: any;
  }>();
  
  // Simple URL formatter for mockup
  function formatUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname.slice(0, 30) + (urlObj.pathname.length > 30 ? '...' : '');
    } catch {
      return url;
    }
  }
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
</script>

<div class="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
  <div class="p-4 border-b border-zinc-800">
    <h3 class="font-medium text-zinc-200">Article Details</h3>
  </div>
  
  <div class="p-4 space-y-3">
    <!-- URL -->
    <div>
      <div class="text-xs text-zinc-500 mb-1">URL</div>
      <div class="flex items-center gap-2">
        <Globe weight="light" class="h-4 w-4 text-zinc-500 flex-shrink-0" />
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          class="text-violet-400 hover:text-violet-300 hover:underline text-sm truncate"
        >
          {formatUrl(article.url)}
        </a>
      </div>
    </div>
    
    <!-- Source -->
    <div>
      <div class="text-xs text-zinc-500 mb-1">Source</div>
      <div class="text-zinc-300 text-sm">{article.source || 'Unknown source'}</div>
    </div>
    
    <!-- Submission Date -->
    <div>
      <div class="text-xs text-zinc-500 mb-1">Submitted</div>
      <div class="flex items-center gap-2">
        <Clock weight="light" class="h-4 w-4 text-zinc-500 flex-shrink-0" />
        <span class="text-zinc-300 text-sm">{formatDate(article.submitted_at)}</span>
      </div>
    </div>
  </div>
  
  <div class="p-4 border-t border-zinc-800">
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      class="flex w-full items-center justify-center gap-2 rounded-lg 
             bg-zinc-800 py-2 px-3 text-sm text-zinc-300
             hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
    >
      <ArrowSquareOut weight="bold" class="h-4 w-4" />
      <span>Open Original</span>
    </a>
  </div>
</div>