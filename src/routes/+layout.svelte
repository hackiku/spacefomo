<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Nav from '$lib/layout/Nav.svelte';
  import Footer from '$lib/layout/Footer.svelte';
  import { createNewsContext } from '$lib/context/newsContext.svelte';
  import { createFomoContext } from '$lib/context/fomoContext.svelte';
  import { setContext } from 'svelte';

  let { data, children } = $props();

  // Create contexts instead of using global stores
  const newsContext = createNewsContext(data.news || []);
  const fomoContext = createFomoContext(data.weeks || []);
  
  // Set contexts for child components to consume
  setContext('news', newsContext);
  setContext('fomo', fomoContext);
</script>

<div class="min-h-screen">
  <Nav />
  <main>
    {@render children()}
  </main>
  <Footer />
</div>