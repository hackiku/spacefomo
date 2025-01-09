<!-- $lib/components/ui/ModeToggle.svelte -->
 
<script lang="ts">
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
 
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
 
<Button 
  on:click={toggleMode} 
  variant="ghost" 
  class="w-9 h-9 p-0"
>
  <div class="relative w-6 h-6">
    <Sun
      class="absolute inset-0 h-full w-full transition-all duration-300
             rotate-0 scale-100 dark:-rotate-90 dark:scale-0
             text-zinc-600 hover:text-zinc-900"
    />
    <Moon
      class="absolute inset-0 h-full w-full transition-all duration-300
             rotate-90 scale-0 dark:rotate-0 dark:scale-100
             text-zinc-400 hover:text-white"
    />
  </div>
  <span class="sr-only">Toggle theme</span>
</Button>
