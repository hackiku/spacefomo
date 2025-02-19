<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
    import { Plus } from 'phosphor-svelte';
    // import { ShareModal } from './cta/share/ShareModal.svelte';
    
    let showShareModal = $state(false);
</script>

<section class="relative overflow-hidden py-20 sm:py-32 bg-black/20 border-b border-white/10">
    <div class="container mx-auto px-4 text-center">
        <!-- Main Heading -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent 
                   bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-6">
            Space race hot news in 100 words a pop
        </h1>

        <!-- Share Button -->
        <button
            onclick={() => showShareModal = true}
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full
                   bg-gradient-to-r from-violet-500 to-fuchsia-500
                   hover:from-violet-600 hover:to-fuchsia-600
                   text-white font-medium transition-all
                   hover:shadow-lg hover:shadow-violet-500/25"
        >
            <Plus class="w-5 h-5" />
            Share News
        </button>
    </div>

    <!-- Gradient Orb -->
    <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full
                bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30
                blur-3xl opacity-50">
		</div>
</section>

<!-- Share Modal -->
<!-- {#if showShareModal}
    <ShareModal on:close={() => showShareModal = false} />
{/if} -->