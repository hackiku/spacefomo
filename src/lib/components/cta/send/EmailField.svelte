<!-- src/lib/components/cta/email/EmailField.svelte -->
<script lang="ts">
  import { Mail } from 'lucide-svelte';
  
  export let value = '';
</script>

<div class="relative">
  <!-- Left icon -->
  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
    <Mail class="w-5 h-5" />
  </div>
  
  <input
    type="email"
    bind:value
    placeholder="you@email.com"
    class="w-full h-14 bg-black/30 border border-white/10 rounded-full
           pl-12 pr-6 text-zinc-100
           placeholder:text-zinc-500 focus:outline-none"
  />
</div>