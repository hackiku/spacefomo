<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import '../app.css';
    import Nav from "$lib/components/navigation/Nav.svelte"
    import Footer from "$lib/components/navigation/Footer.svelte"

    let { children } = $props();
</script>

<div class="overflow-x-hidden">
    <Nav />

    <main class="min-h-screen">
        {@render children()}
    </main>

    <Footer />
</div>