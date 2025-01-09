<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
	import { ModeWatcher } from "mode-watcher";
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SendNews from '$lib/components/cta/SendNews.svelte';
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