<script lang="ts">
  import '../app.css';
  import { cn } from '$lib/utils';
  import Nav from '$lib/components/layout/Nav.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import FomoApp from '$lib/features/fomo/FomoApp.svelte';
  import { browser } from '$app/environment';
  
  // Contexts
  import { createUiContext } from '$lib/context/uiContext.svelte';

  import { createNewsContext } from '$lib/context/newsContext.svelte';
  import { createFomoContext } from '$lib/context/fomoContext.svelte';
  import { createNavContext } from '$lib/context/navContext.svelte';
  import { createCtaContext } from '$lib/context/ctaContext.svelte';
  import { setContext } from 'svelte';

  // Props - data comes from +layout.server.ts
  let { data, children } = $props();

	const uiContext = createUiContext();
  setContext('ui', uiContext);

  // Create contexts in the correct dependency order
  const newsContext = createNewsContext(data.news || []);
  setContext('news', newsContext);
  
  const fomoContext = createFomoContext();
  setContext('fomo', fomoContext);
  
  const navContext = createNavContext();
  const ctaContext = createCtaContext();
  setContext('nav', navContext);
  setContext('cta', ctaContext);

  // Scroll handling state and logic
  let lastScrollY = $state(0);
  let isTopHidden = $state(false);
  let isBottomHidden = $state(false);
  let isNearFooter = $state(false);

  $effect(() => {
    if (!browser) return;
    
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      const scrollThreshold = 5;
      
      if (scrollDelta > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
          isTopHidden = true;
          isBottomHidden = false;
        } else {
          isTopHidden = false;
          isBottomHidden = true;
        }
        
        lastScrollY = currentScrollY;
      }

      // Footer visibility check
      const footerPosition = document.querySelector('footer')?.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      isNearFooter = footerPosition && footerPosition < windowHeight + 100;
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
  <meta
    name="description"
    content="Get the latest space industry news, curated and condensed for busy space enthusiasts."
  />

  <!-- Open Graph defaults -->
  <meta property="og:site_name" content="SpaceFomo" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://spacefomo.com" />
  <meta property="og:title" content="SpaceFomo | Hot Space News ~100 Words a Pop" />
  <meta
    property="og:description"
    content="Get the latest space industry news, curated and condensed for busy space enthusiasts."
  />

  <!-- Twitter Card defaults -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="SpaceFomo" />
  <meta
    name="twitter:description"
    content="Get the latest space industry news, curated and condensed for busy space enthusiasts."
  />

  <!-- SEO -->
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://spacefomo.com" />
</svelte:head>

<!-- Debug tool -->
<!-- <div class="hidden sm:block">
  <ViewportSize />
</div> -->

<div class="relative min-h-screen border-12s _border-background">
  
  <div class="z-50 fixed left-0 min-w-2 md:w-3 bg-background h-screen"></div>
  <div class="z-50 fixed right-0 min-w-2 md:w-3 bg-background h-screen"></div>
  <div class="z-50 fixed top-0 __min-w-2 md:h-3 bg-background w-screen"></div>
  <div class="z-50 fixed bottom-0 h-5 md:h-3 bg-background w-screen"></div>

  <!-- Top navigation - fixed at top, slides up when scrolling down -->
  <div 
    class={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background",
      "transition-transform duration-300 ease-in-out",
      isTopHidden ? "-translate-y-full" : "translate-y-0"
    )}
  >
    <!-- Left/right bezels with auto width -->
    <div class="flex">
      <div class="flex-1 px-4 md:px-8 lg:px-12 xl:px-16">
        <Nav />
      </div>
      <!-- <div class="min-w-1 md:min-w-3 bg-background h-full"></div> -->
    </div>
  </div>

  <!-- Main content -->
  <main class="bg-muted/30 min-h-screen w-full py-16">
    {@render children()}
  </main>

  <!-- Footer in the normal document flow -->
  <Footer />

  <!-- Bottom FOMO App - fixed at bottom, slides down when scrolling up -->
  <div 
    class={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background",
      "transition-transform duration-300 ease-in-out",
      (isBottomHidden || isNearFooter) ? "translate-y-full" : "translate-y-0"
    )}
  >
    <!-- Left/right bezels with auto width -->
    <div class="flex">
      <!-- <div class="min-w-1 md:min-w-3 bg-background h-full"></div> -->
      <div class="flex-1 w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <FomoApp />
      </div>
      <!-- <div class="min-w-1 md:min-w-3 bg-background h-full"></div> -->
    </div>
  </div>
</div>