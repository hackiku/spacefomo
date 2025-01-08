<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SendNews from '$lib/components/cta/SendNews.svelte';
</script>

<div class="min-h-screen bg-background text-foreground">
  <Nav />
  
  <main>
    <slot />
  </main>
  
  <Footer />
  
  <!-- Send Link Button -->
  <SendNews />
</div>