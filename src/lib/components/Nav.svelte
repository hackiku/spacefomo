<!-- $lib/components/Nav.svelte -->
 
<script lang="ts">
  import ModeToggle from "$lib/components/ui/ModeToggle.svelte";
  import { Button } from "$lib/components/ui/button/index.ts";
</script>

<nav class="mt-4 mx-auto rounded-full px-12 py-2 border border-gray-500 flex justify-center items-center space-x-4 w-max">
  <a href="/" class="text-lg font-bold">📡 SpaceFOMO</a>
  <a href="/feed" class="text-gray-400 hover:text-white text-lg">Feed</a>
  <Button variant="outline" class="text-lg">Start</Button>
  <ModeToggle />
</nav>
