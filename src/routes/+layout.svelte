<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/layout/Nav.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { createNewsContext } from '$lib/context/newsContext.svelte';
  import { createFomoContext } from '$lib/context/fomoContext.svelte';
  import { setContext } from 'svelte';

  let { data, children } = $props();

  console.log('Layout data news items:', data.news?.length || 0);

  // Create contexts instead of using global stores
  const newsContext = createNewsContext(data.news || []);
  const fomoContext = createFomoContext(data.weeks || []);
  
  // Set contexts for child components to consume
  setContext('news', newsContext);
  setContext('fomo', fomoContext);
</script>

<svelte:head>
  <!-- Site-wide metadata -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  
  <!-- Default metadata (overridden by pages) -->
  <title>SpaceFomo | Hot Space News ~100 Words a Pop</title>
  <meta name="description" content="Get the latest space industry news, curated and condensed for busy space enthusiasts." />
  
  <!-- Open Graph defaults -->
  <meta property="og:site_name" content="SpaceFomo" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://spacefomo.com" />
  <meta property="og:title" content="SpaceFomo | Hot Space News ~100 Words a Pop" />
  <meta property="og:description" content="Get the latest space industry news, curated and condensed for busy space enthusiasts." />
  
  <!-- Twitter Card defaults -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="SpaceFomo" />
  <meta name="twitter:description" content="Get the latest space industry news, curated and condensed for busy space enthusiasts." />
  
  <!-- Robots and indexing -->
  <meta name="robots" content="index, follow" />
  
  <!-- Canonical URL for home page -->
  <link rel="canonical" href="https://spacefomo.com" />
</svelte:head>

<div class="min-h-screen">
  <Nav />
  <main>
    {@render children()}
  </main>
  <Footer />
</div>