<!-- src/lib/features/news/card/FomoScore.svelte -->

<script lang="ts">
  export let score: number;
  export let onUpvote: () => void = () => {};
  export let onDownvote: () => void = () => {};

  import { ArrowUp, ArrowDown } from 'lucide-svelte';
</script>

<div class="flex flex-col items-center gap-2">
  <!-- Upvote button -->
  <button
    class="p-1.5 rounded-lg transition-colors
           hover:bg-violet-500/10 focus-visible:bg-violet-500/10
           focus:outline-none focus-visible:ring-2 
           focus-visible:ring-violet-500/20"
    on:click={onUpvote}
    aria-label="Upvote"
  >
    <ArrowUp class="w-5 h-5 
                    text-zinc-600 hover:text-violet-500 
                    dark:text-zinc-400 dark:hover:text-violet-400
                    transition-colors" />
  </button>

  <!-- Score with gradient -->
  <div class="text-2xl font-bold bg-clip-text text-transparent
              bg-gradient-to-br from-violet-400 to-fuchsia-500">
    {score}
  </div>

  <!-- Downvote button -->
  <button
    class="p-1.5 rounded-lg transition-colors
           hover:bg-fuchsia-500/10 focus-visible:bg-fuchsia-500/10
           focus:outline-none focus-visible:ring-2 
           focus-visible:ring-fuchsia-500/20"
    on:click={onDownvote}
    aria-label="Downvote"
  >
    <ArrowDown class="w-5 h-5 
                      text-zinc-600 hover:text-fuchsia-500 
                      dark:text-zinc-400 dark:hover:text-fuchsia-400
                      transition-colors" />
  </button>
</div>