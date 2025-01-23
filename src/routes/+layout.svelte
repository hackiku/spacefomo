<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
	import { dev } from '$app/environment';
	import { ModeWatcher } from "mode-watcher";
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SendNews from '$lib/components/cta/SendNews.svelte';

	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	injectAnalytics({ mode: dev ? 'development' : 'production' });

</script>

<ModeWatcher />

<!-- <div class="min-h-screen text-foreground"> -->
  <Nav />
  
  <main>
    <slot />
  </main>
  
  <Footer />
  
  <!-- Send Link Button -->
  <SendNews />
<!-- </div> -->

<style>
  :global(html) {
    overflow-x: hidden;
  }
</style>