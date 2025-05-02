<!-- src/lib/features/fomo/FomoSlider.svelte -->
<script lang="ts">
    import { Slider } from 'bits-ui';
    
    let { 
        score = $bindable(50),
        onUpvote,
        onDownvote 
    } = $props<{
        score: number;
        onUpvote?: () => void;
        onDownvote?: () => void;
    }>();
</script>

<div class="space-y-2">
    <Slider.Root 
        type="single"
        min={0}
        max={100}
        step={1}
        bind:value={score}
        class="relative flex w-full touch-none select-none items-center"
    >
        {#snippet children()}
            <!-- Track -->
            <div class="relative h-4 rounded-full bg-zinc-800/50 backdrop-blur-sm cursor-pointer w-full">
                <!-- Range/Progress Bar -->
                <Slider.Range 
                    class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500
                          transition-all duration-200"
                />
                
                <!-- Thumb with Score -->
                <Slider.Thumb 
                    index={0}
                    class="absolute top-1/2 -translate-y-1/2
                          w-12 h-12 rounded-full bg-white shadow-lg
                          flex items-center justify-center
                          text-lg font-bold cursor-grab active:cursor-grabbing
                          bg-gradient-to-br from-violet-500 to-fuchsia-500
                          text-white"
                >
                    {score}
                </Slider.Thumb>
            </div>
        {/snippet}
    </Slider.Root>
    
    <!-- Optional: Quick adjust buttons -->
    {#if onUpvote || onDownvote}
        <div class="flex justify-end gap-2 pt-1">
            {#if onDownvote}
                <button 
                    type="button"
                    onclick={onDownvote}
                    class="px-2 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                    Less FOMO
                </button>
            {/if}
            
            {#if onUpvote}
                <button 
                    type="button"
                    onclick={onUpvote}
                    class="px-2 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                    More FOMO
                </button>
            {/if}
        </div>
    {/if}
</div>