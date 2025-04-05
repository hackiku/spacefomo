<!-- src/routes/news/[slug]/+page.svelte -->
<script>
  import { browser } from '$app/environment';
  import { ArrowLeft } from 'phosphor-svelte';
  
  // Import existing components
  import ViralTitle from '$lib/features/news/card/ViralTitle.svelte';
  import DevJson from '$lib/features/news/card/DevJson.svelte';
  import SourceContainer from '$lib/features/news/source/SourceContainer.svelte';
  import ArticleEntities from '$lib/features/news/article/ArticleEntities.svelte';
  import ArticleTimeline from '$lib/features/news/article/ArticleTimeline.svelte';
  import SlugSidebar from './SlugSidebar.svelte';
  
  let { data } = $props();
  const { article } = data;
  
  let showJson = $state(false);
  
  // SEO metadata preparation
  const seo = article.seo || {};
  
  // Derive SEO values with fallbacks
  const metaTitle = seo.title || article.viral_title || article.title;
  const metaDescription = seo.description || article.summary || `Read about ${article.title} on SpaceFomo.`;
  const keywords = seo.keywords || article.tags || [];
  const canonicalUrl = seo.canonical_url || `https://spacefomo.com/news/${article.slug || article.id}`;
  
  // Prepare structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": seo.article_type || "NewsArticle",
    "headline": article.title,
    "datePublished": article.publication_date,
    "dateModified": article.created_at,
    "description": article.summary,
    "author": {
      "@type": "Organization",
      "name": "SpaceFomo"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SpaceFomo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://spacefomo.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };
  
  // Extract entities for SEO
  const entityNames = [];
  if (article.entities) {
    if (article.entities.people) {
      article.entities.people.forEach(person => entityNames.push(person.name));
    }
    if (article.entities.companies) {
      article.entities.companies.forEach(company => entityNames.push(company.name));
    }
  }
  
  // Analytics tracking on page view
  $effect(() => {
    if (browser) {
      // Analytics tracking would go here
    }
  });
</script>

<svelte:head>
  <title>{metaTitle} | SpaceFomo</title>
  <meta name="description" content={metaDescription} />
  
  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalUrl} />
  
  <!-- Keywords (combine tags and extracted entities) -->
  <meta name="keywords" content={[...keywords, ...entityNames].join(', ')} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={metaTitle} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="SpaceFomo" />
  {#if article.publication_date}
    <meta property="article:published_time" content={new Date(article.publication_date).toISOString()} />
  {/if}
  {#if article.tags && article.tags.length > 0}
    {#each article.tags as tag}
      <meta property="article:tag" content={tag} />
    {/each}
  {/if}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={metaTitle} />
  <meta name="twitter:description" content={metaDescription} />
  
  <!-- Structured Data -->
  <script type="application/ld+json">
    {JSON.stringify(structuredData)}
  </script>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-12">
  <!-- Back button -->
  <div class="mb-8">
    <a href="/news" class="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
      <ArrowLeft class="w-5 h-5" />
      <span>Back to news</span>
    </a>
  </div>
  
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Main Content Column -->
    <div class="flex-1 space-y-10">
      <!-- Title -->
      <ViralTitle title={article.title} viralTitle={article.viral_title} />
      
      <!-- Source Container -->
      <SourceContainer {article} />
      
      <!-- Summary Section -->
      {#if article.summary}
        <div class="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 backdrop-blur-sm p-6">
          <h2 class="text-lg font-medium text-zinc-200 mb-4">Summary</h2>
          <p class="text-zinc-300 leading-relaxed">{article.summary}</p>
        </div>
      {/if}
      
      <!-- Entities -->
      <ArticleEntities entities={article.entities} />
      
      <!-- Timeline -->
      {#if article.context?.timeline}
        <ArticleTimeline timeline={article.context.timeline} />
      {/if}
      
      <!-- Raw Data Toggle Button -->
      <div class="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button 
          type="button"
          class="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          onclick={() => showJson = !showJson}
        >
          <span>{showJson ? 'Hide Raw Data' : 'Show Raw Data'}</span>
        </button>
      </div>
      
      <!-- JSON Data Panel -->
      {#if showJson}
        <div>
          <DevJson 
            data={{
              context: article.context,
              entities: article.entities,
              seo: article.seo
            }}
            onClose={() => showJson = false}
          />
        </div>
      {/if}
    </div>
    
    <!-- Sidebar -->
    <SlugSidebar {article} />
  </div>
</div>