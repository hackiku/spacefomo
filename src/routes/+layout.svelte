<!-- routes/+layout.svelte -->
<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
	import SendNews from '$lib/components/cta/SendNews.svelte'
</script>

<div class="min-h-screen flex flex-col bg-background font-sans">
  <ModeWatcher />
  <Nav />
  <main class="flex-1">
    <slot />
  </main>
  <Footer />
</div>

<SendNews />

<style>
  /* Optional: If you want a more refined system font stack */
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
  }
</style>