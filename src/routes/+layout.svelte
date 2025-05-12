<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
	import { cn } from '$lib/utils'
  import Nav from '$lib/components/layout/Nav.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import FomoApp from '$lib/features/fomo/FomoApp.svelte';
  import ViewportSize from '$lib/components/dev/ViewportSize.svelte';
  import { browser } from '$app/environment';
  
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
  
  // Scroll handling for bezel collapse
  let lastScrollY = $state(0);
  let isTopCollapsed = $state(false);
  let isBottomCollapsed = $state(false);
  
  // Effect for scroll detection
  $effect(() => {
    if (!browser) return;
    
    function handleScroll() {
      if (window.scrollY > 100 && window.scrollY > lastScrollY) {
        // Scrolling down - collapse top
        isTopCollapsed = true;
        isBottomCollapsed = false;
      } else if (window.scrollY < lastScrollY) {
        // Scrolling up - collapse bottom
        isTopCollapsed = false;
        isBottomCollapsed = true;
      }
      
      // Update last scroll position
      lastScrollY = window.scrollY;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
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

<!-- Main container -->
<div class="relative min-h-screen flex flex-col bg-background overflow-x-hidden">
  <!-- Bezel system wrapper -->
  <div class="sticky flex-1 flex flex-col">
    <!-- Top bezel - collapses on scroll down -->
    <div 
      class="sticky top-0 z-40 w-full transition-all duration-300"
      class:h-3={isTopCollapsed}
    >
      <Nav />
    </div>
    
    <!-- Content with side bezels -->
    <div class="flex-1 flex">
      <!-- Left bezel -->
      <div class="w-3 shrink-0"></div>
      
      <!-- Center content -->
      <main class="flex-1 rounded-2xl bg-card my-3 overflow-hidden">
        {@render children()}
      </main>
      
      <!-- Right bezel -->
      <div class="w-0 shrink-0"></div>
    </div>
    
    <!-- Bottom bezel - contains FomoApp -->
    <div 
      class="sticky bottom-0 z-40 w-full transition-all duration-300"
      class:h-3={isBottomCollapsed}
    >
      <FomoApp />
    </div>
  </div>
  
  <!-- Footer (outside the bezel system) -->
  <Footer />
</div>