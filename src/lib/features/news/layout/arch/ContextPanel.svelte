<!-- src/lib/features/news/layout/ContextPanel.svelte -->
<script lang="ts">
  import { CaretDown } from 'phosphor-svelte';
  import { useNews } from '$lib/hooks';
  import ArticleTags from '../article/tags/ArticleTags.svelte';
  import ArticleEntities from '../article/ArticleEntities.svelte';
  
  let {
    onClose = () => {}
  } = $props<{
    onClose?: () => void;
  }>();
  
  // Get the news context
  const { getActiveItem, items } = useNews();
  
  // Active article derived from context
  const activeArticle = $derived(getActiveItem());
  
  // Sections state
  let showTags = $state(true);
  let showEntities = $state(true);
  let showRelated = $state(true);
  
  // Toggle section visibility
  function toggleSection(section: 'tags' | 'entities' | 'related') {
    if (section === 'tags') showTags = !showTags;
    if (section === 'entities') showEntities = !showEntities;
    if (section === 'related') showRelated = !showRelated;
  }
  
  // Get related articles based on tags
  const relatedArticles = $derived(() => {
    if (!activeArticle || !activeArticle.tags || activeArticle.tags.length === 0) {
      return [];
    }
    
    // Find articles that share tags with the active article
    return items
      .filter(article => 
        article.id !== activeArticle.id && // Not the current article
        article.tags && // Has tags
        article.tags.some(tag => activeArticle.tags!.includes(tag)) // Shares at least one tag
      )
      .sort((a, b) => {
        // Count matching tags
        const aMatchCount = a.tags!.filter(tag => activeArticle.tags!.includes(tag)).length;
        const bMatchCount = b.tags!.filter(tag => activeArticle.tags!.includes(tag)).length;
        
        // Sort by match count then by fomo score
        if (bMatchCount !== aMatchCount) {
          return bMatchCount - aMatchCount;
        }
        return (b.fomo_score || 0) - (a.fomo_score || 0);
      })
      .slice(0, 5); // Limit to 5 related articles
  });
  
  // Collect all unique entities from active article
  const allEntities = $derived(() => {
    if (!activeArticle || !activeArticle.entities) {
      return null;
    }
    
    return {
      companies: activeArticle.entities.companies || [],
      people: activeArticle.entities.people || [],
      technologies: activeArticle.entities.technologies || [],
      facilities: activeArticle.entities.facilities || []
    };
  });
  
  // Format date
  function formatDate(date: Date | null | undefined) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="h-full overflow-y-auto">
  <div class="space-y-6 pb-8">
    <div class="sticky top-0 bg-zinc-900 z-10 py-3 border-b border-zinc-800 flex items-center justify-between">
      <h2 class="text-sm font-medium text-zinc-300">
        {activeArticle ? 'Article Context' : 'Context Panel'}
      </h2>
      <button
        type="button"
        class="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
        onclick={onClose}
        aria-label="Close panel"
      >
        ×
      </button>
    </div>
    
    {#if !activeArticle}
      <!-- No active article state -->
      <div class="p-4 text-sm text-zinc-500 bg-zinc-800/20 rounded-lg border border-zinc-800/60">
        Select an article to see contextual information
      </div>
    {:else}
      <!-- Tags Section -->
      <div class="space-y-2">
        <button
          type="button"
          class="flex items-center justify-between w-full text-sm"
          onclick={() => toggleSection('tags')}
          aria-expanded={showTags}
        >
          <span class="font-medium text-zinc-300">Tags</span>
          <CaretDown 
            class="w-4 h-4 text-zinc-500 transition-transform duration-200"
          />
        </button>
        
        {#if showTags && activeArticle.tags && activeArticle.tags.length > 0}
          <div class="pt-1">
            <ArticleTags tags={activeArticle.tags} />
          </div>
        {:else if showTags}
          <div class="p-3 text-sm text-zinc-500 bg-zinc-800/20 rounded-lg border border-zinc-800/60">
            No tags available
          </div>
        {/if}
      </div>
      
      <!-- Entities Section -->
      <div class="space-y-2">
        <button
          type="button"
          class="flex items-center justify-between w-full text-sm"
          onclick={() => toggleSection('entities')}
          aria-expanded={showEntities}
        >
          <span class="font-medium text-zinc-300">Entities</span>
          <CaretDown 
            class="w-4 h-4 text-zinc-500 transition-transform duration-200"
          />
        </button>
        
        {#if showEntities && allEntities && (
          allEntities.companies.length > 0 || 
          allEntities.people.length > 0 || 
          allEntities.technologies.length > 0 || 
          allEntities.facilities.length > 0
        )}
          <div class="pt-1">
            <ArticleEntities entities={allEntities} />
          </div>
        {:else if showEntities}
          <div class="p-3 text-sm text-zinc-500 bg-zinc-800/20 rounded-lg border border-zinc-800/60">
            No entities available
          </div>
        {/if}
      </div>
      
      <!-- Related Articles Section -->
      <div class="space-y-2">
        <button
          type="button"
          class="flex items-center justify-between w-full text-sm"
          onclick={() => toggleSection('related')}
          aria-expanded={showRelated}
        >
          <span class="font-medium text-zinc-300">Related Articles</span>
          <CaretDown 
            class="w-4 h-4 text-zinc-500 transition-transform duration-200" 
            class:rotate-180={showRelated}
          />
        </button>
        
        {#if showRelated && relatedArticles.length > 0}
          <div class="space-y-2 pt-1">
            {#each relatedArticles as article}
              <button 
                type="button"
                class="w-full p-3 bg-zinc-800/30 border border-zinc-700/50 rounded-lg text-left hover:bg-zinc-800/60 transition-colors"
                onclick={() => useNews().setActiveItem(article.id)}
              >
                <div class="flex justify-between items-start gap-2">
                  <span class="text-sm text-zinc-300 line-clamp-2">{article.viral_title || article.title}</span>
                  <span class="flex-shrink-0 text-lg font-medium bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-fuchsia-500">
                    {article.fomo_score || 0}
                  </span>
                </div>
                <div class="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                  <span>{article.source || 'Unknown'}</span>
                  {#if article.publication_date}
                    <span class="text-zinc-700">•</span>
                    <span>{formatDate(article.publication_date)}</span>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        {:else if showRelated}
          <div class="p-3 text-sm text-zinc-500 bg-zinc-800/20 rounded-lg border border-zinc-800/60">
            No related articles found
          </div>
        {/if}
      </div>
      
      <!-- FOMO Impact Section -->
      <div class="space-y-2">
        <h3 class="text-sm font-medium text-zinc-300">FOMO Impact</h3>
        
        <div class="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
          <div class="flex items-center gap-3 mb-3">
            <div class="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-fuchsia-500">
              {activeArticle.fomo_score || 0}
            </div>
            <div class="text-zinc-500">FOMO Score</div>
          </div>
          
          {#if activeArticle.impact_score}
            <div class="text-sm text-zinc-400">
              Industry impact: <span class="text-zinc-300">{activeArticle.impact_score}/100</span>
            </div>
          {/if}
          
          {#if activeArticle.context?.timeline?.phase}
            <div class="text-sm text-zinc-400 mt-2">
              Timeline phase: <span class="text-zinc-300">{activeArticle.context.timeline.phase}</span>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Source Details -->
      <div class="space-y-2">
        <h3 class="text-sm font-medium text-zinc-300">Source Details</h3>
        
        <div class="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
          <div class="text-sm text-zinc-400">
            <div class="mb-2">
              <span class="text-zinc-500">Source:</span> 
              <span class="text-zinc-300">{activeArticle.source || 'Unknown'}</span>
            </div>
            
            {#if activeArticle.publication_date}
              <div class="mb-2">
                <span class="text-zinc-500">Published:</span> 
                <span class="text-zinc-300">{formatDate(activeArticle.publication_date)}</span>
              </div>
            {/if}
            
            {#if activeArticle.read_time}
              <div>
                <span class="text-zinc-500">Read time:</span> 
                <span class="text-zinc-300">{activeArticle.read_time} min</span>
              </div>
            {/if}
          </div>
          
          <div class="mt-3 pt-3 border-t border-zinc-700/50">
            <a 
              href={activeArticle.url} 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-xs w-full flex items-center justify-center text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors py-2 rounded-lg"
            >
              Visit Original Article
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>