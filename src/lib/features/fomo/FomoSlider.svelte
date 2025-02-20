<!-- src/lib/features/fomo/FomoSlider.svelte -->
<script lang="ts">
    let { score } = $props<{
        score: number;
    }>();

    function updateScore(e: MouseEvent) {
        const slider = e.currentTarget as HTMLDivElement;
        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.round((x / rect.width) * 100);
        score = Math.max(0, Math.min(100, percentage));
    }

    // For dragging functionality
    let isDragging = $state(false);

    function handleMouseDown() {
        isDragging = true;
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleMouseMove(e: MouseEvent) {
        if (isDragging) {
            updateScore(e);
        }
    }
</script>

<svelte:window 
    onmouseup={handleMouseUp}
    onmousemove={handleMouseMove}
/>

<div class="space-y-2">
    <!-- Track and Thumb -->
    <div 
        class="relative h-4 rounded-full bg-zinc-800/50 backdrop-blur-sm cursor-pointer"
        onclick={updateScore}
        onmousedown={handleMouseDown}
    >
        <!-- Progress Bar -->
        <div 
            class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500
                   transition-all duration-200"
            style="width: {score}%"
        >
            <!-- Knob with Score -->
            <div 
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                       w-12 h-12 rounded-full bg-white shadow-lg
                       flex items-center justify-center
                       text-lg font-bold cursor-grab active:cursor-grabbing
                       bg-gradient-to-br from-violet-500 to-fuchsia-500
                       text-white"
            >
                {score}
            </div>
        </div>
    </div>
</div>

<style>
    /* Optional: Add smooth transition for the score text */
    .score-transition {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>