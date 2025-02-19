<!-- src/lib/components/cta/share/ShareModal.svelte -->
<script lang="ts">
    import { scale, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { X, Envelope, Plus } from 'phosphor-svelte';
    import FomoSlider from '$lib/features/fomo/FomoSlider.svelte';
    
    let { onClose } = $props<{
        onClose: () => void;
    }>();

    // Form state
    let url = $state('');
    let email = $state('');
    let comment = $state('');
    let fomoScore = $state<number | null>(null);
    let loading = $state(false);
    let status = $state<'idle' | 'success' | 'error'>('idle');

    async function handleSubmit() {
        if (!url) return;
        
        loading = true;
        status = 'idle';
        
        try {
            const response = await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'send-news',
                    url,
                    comment: comment || undefined,
                    fomoScore: fomoScore || undefined,
                    email: email || undefined
                })
            });
            
            if (!response.ok) throw new Error();
            
            status = 'success';
            setTimeout(() => onClose(), 1500);
        } catch (err) {
            status = 'error';
        } finally {
            loading = false;
        }
    }

    function handleOutsideClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }
</script>

<a 
    type="button"
		class="fixed inset-0 z-50"
    transition:fade={{ duration: 200 }}
    on:click={handleOutsideClick}
>
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    
    <!-- Modal -->
    <div class="relative h-full flex items-center justify-center p-4">
        <div
            class="w-full max-w-2xl bg-zinc-900/95 rounded-3xl border border-white/10 
                   overflow-hidden backdrop-blur-sm"
            transition:scale={{ duration: 300, easing: cubicOut, start: 0.5 }}
        >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-white/10">
                <h2 class="text-2xl font-medium text-zinc-100">Share Space News</h2>
                <button
                    class="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg 
                           hover:bg-white/5 transition-colors"
                    on:click={onClose}
                >
                    <X class="w-6 h-6" />
                </button>
            </div>

            <!-- Form -->
            <div class="p-6 space-y-6">
                <!-- URL Input -->
                <div class="space-y-2">
                    <label for="url" class="block text-sm font-medium text-zinc-400">
                        News URL
                    </label>
                    <input
                        id="url"
                        type="url"
                        bind:value={url}
                        placeholder="https://..."
                        class="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/10
                               text-zinc-100 placeholder:text-zinc-600
                               focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                </div>

                <!-- FOMO Score -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-zinc-400">
                        FOMO Score
                    </label>
                    <FomoSlider 
                        score={fomoScore ?? 0} 
                        onUpvote={() => fomoScore = Math.min((fomoScore ?? 0) + 1, 100)}
                        onDownvote={() => fomoScore = Math.max((fomoScore ?? 0) - 1, 0)}
                    />
                </div>

                <!-- Comment -->
                <div class="space-y-2">
                    <label for="comment" class="block text-sm font-medium text-zinc-400">
                        Why is this interesting?
                    </label>
                    <textarea
                        id="comment"
                        bind:value={comment}
                        rows="3"
                        class="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/10
                               text-zinc-100 placeholder:text-zinc-600
                               focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                </div>

                <!-- Email (Optional) -->
                <div class="space-y-2">
                    <label for="email" class="block text-sm font-medium text-zinc-400">
                        Your email (optional)
                    </label>
                    <input
                        id="email"
                        type="email"
                        bind:value={email}
                        placeholder="you@example.com"
                        class="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/10
                               text-zinc-100 placeholder:text-zinc-600
                               focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                </div>

                <!-- Submit Button -->
                <button
                    on:click={handleSubmit}
                    disabled={loading || !url}
                    class="w-full flex items-center justify-center gap-2 px-6 py-3 
                           bg-gradient-to-r from-violet-500 to-fuchsia-500
                           hover:from-violet-600 hover:to-fuchsia-600
                           disabled:opacity-50 disabled:cursor-not-allowed
                           text-white rounded-lg transition-all"
                >
                    {#if loading}
                        <Plus class="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                    {:else}
                        <Envelope class="w-5 h-5" />
                        <span>Share News</span>
                    {/if}
                </button>

                <!-- Status Messages -->
                {#if status === 'success'}
                    <p class="text-emerald-400 text-sm text-center" transition:fade>
                        News shared successfully!
                    </p>
                {:else if status === 'error'}
                    <p class="text-red-400 text-sm text-center" transition:fade>
                        Failed to share news. Please try again.
                    </p>
                {/if}
            </div>
        </div>
    </div>
	</a>