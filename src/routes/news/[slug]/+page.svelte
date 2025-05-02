<!-- src/routes/news/[slug]/+page.svelte -->
<script>
  import { browser } from '$app/environment';
  
  // Import the PageArticle component
  import PageArticle from '$lib/features/news/article/PageArticle.svelte';
  import SlugSidebar from './SlugSidebar.svelte';
  
  let { data } = $props();
  const { article } = data;
  
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

<div class="py-24">
  <div class="max-w-[1920px] mx-auto px-4 sm:px-10 md:px-16 lg:px-24 xl:px-44">
    <div class="flex flex-col md:flex-row gap-12">
      <!-- Main Content Column -->
      <div class="flex-1">
        <PageArticle {article} />
      </div>
      
      <!-- Sidebar -->
      <SlugSidebar {article} />
    </div>
  </div>
</div>