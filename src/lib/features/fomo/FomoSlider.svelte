<!-- src/lib/features/fomo/FomoSlider.svelte -->
<script lang="ts">
    import { ArrowUp, ArrowDown } from 'phosphor-svelte';
    
    let { score, onUpvote, onDownvote } = $props<{
        score: number;
        onUpvote?: () => void;
        onDownvote?: () => void;
    }>();
</script>

<div class="flex flex-col items-center gap-2">
    <!-- Upvote button -->
    <button
        onclick={onUpvote}
        class="p-1.5 rounded-lg transition-colors
               hover:bg-violet-500/10 focus-visible:bg-violet-500/10
               focus:outline-none focus-visible:ring-2 
               focus-visible:ring-violet-500/20"
        aria-label="Increase FOMO score"
    >
        <ArrowUp
            weight="bold" 
            class="w-5 h-5 text-zinc-600 hover:text-violet-500 
                   dark:text-zinc-400 dark:hover:text-violet-400
                   transition-colors"
        />
    </button>

    <!-- Score with gradient -->
    <div class="text-2xl font-bold bg-clip-text text-transparent
                bg-gradient-to-br from-violet-400 to-fuchsia-500">
        {score}
    </div>

    <!-- Downvote button -->
    <button
        onclick={onDownvote}
        class="p-1.5 rounded-lg transition-colors
               hover:bg-fuchsia-500/10 focus-visible:bg-fuchsia-500/10
               focus:outline-none focus-visible:ring-2 
               focus-visible:ring-fuchsia-500/20"
        aria-label="Decrease FOMO score"
    >
        <ArrowDown
            weight="bold"
            class="w-5 h-5 text-zinc-600 hover:text-fuchsia-500 
                   dark:text-zinc-400 dark:hover:text-fuchsia-400
                   transition-colors"
        />
    </button>
</div>