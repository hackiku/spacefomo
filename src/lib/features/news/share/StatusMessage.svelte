<!-- src/lib/components/cta/share/StatusMessage.svelte -->
<script lang="ts">
    import { fade } from 'svelte/transition';
    
    let { type } = $props<{
        type: 'idle' | 'success' | 'error';
    }>();

    const messages = {
        success: 'News shared successfully!',
        error: 'Failed to share news. Please try again.',
        idle: ''
    };
</script>

{#if type !== 'idle'}
    <p 
        class="text-sm text-center {type === 'success' ? 'text-emerald-400' : 'text-red-400'}"
        transition:fade
    >
        {messages[type]}
    </p>
{/if}