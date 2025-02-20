<!-- src/lib/components/cta/share/ShareModal.svelte -->
<script lang="ts">
    import { scale, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { X, Envelope } from 'phosphor-svelte';
    import FomoSlider from '$lib/features/fomo/FomoSlider.svelte';
    import UrlInput from './inputs/UrlInput.svelte';
    import CommentInput from './inputs/CommentInput.svelte';
    import EmailInput from './inputs/EmailInput.svelte';
    import SubmitButton from './SubmitButton.svelte';
    import StatusMessage from './StatusMessage.svelte';
    
    let { onClose } = $props<{
        onClose: () => void;
    }>();

    // Form state using Svelte 5's $state
    let formData = $state({
        url: '',
        email: '',
        comment: '',
        fomoScore: 0
    });

    let status = $state({
        loading: false,
        type: 'idle' as 'idle' | 'success' | 'error'
    });
</script>

<div 
    role="dialog"
    aria-labelledby="modal-title"
    class="fixed inset-0 z-50"
    transition:fade={{ duration: 200 }}
    onclick={(e) => e.target === e.currentTarget && onClose()}
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
            <header class="flex items-center justify-between p-6 border-b border-white/10">
                <h2 id="modal-title" class="text-2xl font-medium text-zinc-100">
                    Share Space News
                </h2>
                <button
                    class="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg 
                           hover:bg-white/5 transition-colors"
                    onclick={onClose}
                >
                    <X weight="bold" class="w-6 h-6" />
                </button>
            </header>

            <!-- Form -->
            <div class="p-6 space-y-6">
                <UrlInput bind:value={formData.url} />

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-zinc-400">
                        FOMO Score
                    </label>
                    <FomoSlider 
                        score={formData.fomoScore}
                        onUpvote={() => formData.fomoScore = Math.min(formData.fomoScore + 1, 100)}
                        onDownvote={() => formData.fomoScore = Math.max(formData.fomoScore - 1, 0)}
                    />
                </div>

                <CommentInput bind:value={formData.comment} />
                <EmailInput bind:value={formData.email} />

                <button
                    class="w-full flex items-center justify-center gap-2 px-6 py-3 
                           bg-gradient-to-r from-violet-500 to-fuchsia-500
                           hover:from-violet-600 hover:to-fuchsia-600
                           text-white rounded-lg transition-all"
                    onclick={() => onClose()}
                >
                    <Envelope weight="bold" class="w-5 h-5" />
                    <span>Share News</span>
                </button>
            </div>
        </div>
    </div>
</div>