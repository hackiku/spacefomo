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
  let scrollDirection = $state('none'); // 'up', 'down', or 'none'
  let isTopBezelCollapsed = $state(false);
  let isBottomBezelCollapsed = $state(false);
  let isNearFooter = $state(false);
  
  // Effect for scroll handling
  $effect(() => {
    if (!browser) return;
    
    function handleScroll() {
      // Get current scroll position
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        scrollDirection = 'down';
        isTopBezelCollapsed = true;
        isBottomBezelCollapsed = false;
      } else if (currentScrollY < lastScrollY) {
        scrollDirection = 'up';
        isTopBezelCollapsed = false;
        isBottomBezelCollapsed = true;
      }
      
      // Check if we're near the footer
      const footerPosition = document.querySelector('footer')?.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (footerPosition && footerPosition < windowHeight + 100) {
        isNearFooter = true;
      } else {
        isNearFooter = false;
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
  <!-- Main content -->
  <main class="w-full min-h-screen bg-muted/30">
    {@render children()}
  </main>
  
  <!-- Footer in the normal document flow -->
  <Footer />
  
  <!-- HUD overlay with CSS grid for bezels -->
  <div class="fixed inset-0 pointer-events-none z-10">
    <div class="w-full h-full grid grid-cols-[minmax(0.5rem,auto)_1fr_minmax(0.10rem,auto)] grid-rows-[auto_1fr_auto]">
      <!-- Top row: Nav (collapses when scrolling down) -->
      <div 
        class={cn(
          "col-span-3 bg-background pointer-events-auto overflow-hidden",
          "transition-all duration-200 ease-in-out pb-3",
					"px-4 md:px-8 lg:px-12 xl:px-16",
          isTopBezelCollapsed ? "h-3 _pb-3" : "h-16 pt-3 "
        )}
      >
        <!-- <div class={cn("w-full transition-transform duration-500 ease-in-out", 
                       isTopBezelCollapsed ? "translate-y-0" : "translate-y-full")}> -->
          <Nav />
        <!-- </div> -->
      </div>
      
      <!-- Left bezel -->
      <div class="bg-background min-w-1 md:min-w-3"></div>
      
      <!-- Center cutout -->
      <div class="w-full h-full outline-12 outline-background rounded-2xl"></div>
      
      <!-- Right bezel -->
      <div class="bg-background min-w-0"></div>
      
      <!-- Bottom row: FomoApp (collapses when scrolling up or near footer) -->
<div 
  class={cn(
    "relative col-span-3 bg-background pointer-events-auto overflow-hidden w-full",
    "transition-all __duration-200 __ease-in-out origin-bottom",
		"px-4 md:px-8 lg:px-12 xl:px-16", 
    (isBottomBezelCollapsed || isNearFooter) ? "h-3 pt-3" : "h-full"
  )}
>
	<FomoApp />
</div>
    </div>
  </div>
</div>