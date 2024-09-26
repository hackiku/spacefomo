<!-- $lib/components/Nav.svelte -->

<script lang="ts">
  import ModeToggle from "$lib/components/ui/ModeToggle.svelte";
</script>

<nav class="mt-8 mx-auto flex justify-between items-center max-w-7xl px-4 sm:px-6 lg:px-8">
  <a href="/" class="text-lg text-gray-500 font-thin flex items-center">
    <span class="mr-2" aria-hidden="true">🛰️</span>
    <span>Spacefomo</span>
  </a>
  <ModeToggle />
</nav>