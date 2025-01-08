<!-- routes/+layout.svelte -->
<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="min-h-screen flex flex-col bg-black font-['Space_Grotesk']">
  <ModeWatcher />
  <Nav />
  <main class="flex-1">
    <slot />
  </main>
  <Footer />
</div>