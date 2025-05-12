<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { cn } from '$lib/utils';
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
  
  // Scroll variables
  let lastScrollY = $state(0);
  let scrollRatio = $state(1); // 1 = fully expanded, 0 = fully collapsed
  
  // Effect for smooth scroll handling
  $effect(() => {
    if (!browser) return;
    
    function handleScroll() {
      // Calculate scroll velocity
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Calculate scroll ratio based on direction and velocity
      // Starts at 1 (fully expanded)
      // Decreases when scrolling down (min 0)
      // Increases when scrolling up (max 1)
      if (scrollDelta > 0) {
        // Scrolling down - decrease ratio
        scrollRatio = Math.max(0, scrollRatio - (scrollDelta * 0.01));
      } else if (scrollDelta < 0) {
        // Scrolling up - increase ratio
        scrollRatio = Math.min(1, scrollRatio - (scrollDelta * 0.01));
      }
      
      // Update last scroll position
      lastScrollY = currentScrollY;
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

<div class="relative min-h-screen">
  <!-- Main content at full width/height -->
  <main class="w-full min-h-screen bg-card">
    {@render children()}
  </main>
  
  <!-- Footer in the normal document flow -->
  <Footer />
  
  <!-- HUD overlay with CSS grid for bezels -->
  <!-- <div class="fixed inset-r-2 inset-l-12 inset-t-0 inset-b-0 pointer-events-none z-10 "> -->
		<div class="fixed inset-0 pointer-events-none z-10 ">
    <div class="w-full h-full grid grid-cols-[minmax(0.75rem,auto)_1fr_minmax(0.75rem,auto)] grid-rows-[minmax(0.75rem,auto)_1fr_minmax(0.75rem,auto)]">
      <!-- Top row: Nav -->
      <div 
        class="col-span-3 bg-background/90 backdrop-blur-sm pointer-events-auto transition-all duration-300"
        style={`height: calc(4rem * ${scrollRatio} + 0.75rem * ${1 - scrollRatio})`}
      >
        <Nav />
      </div>
      
      <!-- Left bezel -->
      <div class="bg-background min-w-3 transition-all duration-300"></div>
      
      <!-- Center cutout -->
      <div class="w-full h-full outline-12 outline-background rounded-2xl"></div>
      
      <!-- Right bezel -->
      <div class="bg-background min-w-3">
		</div>
      
      <!-- Bottom row: FomoApp -->
      <div 
        class="col-span-3 bg-background backdrop-blur-sm pointer-events-auto transition-all duration-300"
        style={`height: calc(4rem * ${scrollRatio} + 0.75rem * ${1 - scrollRatio})`}
      >
        <FomoApp />
      </div>
    </div>
  </div>
</div>