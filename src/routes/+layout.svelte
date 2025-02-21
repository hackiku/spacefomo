<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import '../app.css';
    import Nav from "$lib/layout/Nav.svelte"
    import Footer from "$lib/layout/Footer.svelte"

    let { children } = $props();
</script>

<div class="">
    <Nav />

    <main class="min-h-screen">
        {@render children()}
    </main>

    <Footer />
</div>