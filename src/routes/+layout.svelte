<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/layout/Nav.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import FomoApp from '$lib/features/fomo/FomoApp.svelte';
  import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
  
  // Contexts
  import { createNewsContext } from '$lib/context/newsContext.svelte';
  import { createFomoContext } from '$lib/context/fomoContext.svelte';
  import { createNavContext } from '$lib/context/navContext.svelte';
  import { createCtaContext } from '$lib/context/ctaContext.svelte';
  import { setContext } from 'svelte';

  // Props
  let { data, children } = $props();

  // Create contexts
  const newsContext = createNewsContext(data.news || []);
  const fomoContext = createFomoContext(data.weeks || []);
  const navContext = createNavContext();
  const ctaContext = createCtaContext();
  
  // Set contexts
  setContext('news', newsContext);
  setContext('fomo', fomoContext);
  setContext('nav', navContext);
  setContext('cta', ctaContext);
  
  // Constants
  const FOMO_HEIGHT = "3.5rem";
</script>

<svelte:head>
  <!-- Site-wide metadata -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0D0B14" />
  
  <!-- Default metadata -->
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
  
  <!-- SEO -->
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://spacefomo.com" />
</svelte:head>

<!-- Debug tool -->
<div class="hidden md:block">
  <ViewportSize />
</div>

<!-- Main layout -->
<div class="relative min-h-screen flex flex-col bg-background overflow-hidden">
  <!-- Navigation -->
  <Nav />
  
  <!-- Main content area -->
  <div class="flex flex-col flex-grow px-1 md:pl-3 py-4 md:py-12">
    <!-- Central content container -->
    <div class="w-full __max-w-6xl mx-auto">
      <!-- Rounded content container -->
      <div class="bg-card border border-border rounded-lg overflow-hidden __mb-14">
        <main class="__p-4 __md:p-6">
          {@render children()}
        </main>
      </div>
    </div>

		<div class="absolute bottom-0 left-0 right-0 z-40 bg-background" >
			<FomoApp />
		</div>
		<div class="w-full mt-auto">
			<Footer />
		</div>
  </div>
  
</div>