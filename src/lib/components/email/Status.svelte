<!-- src/lib/components/cta/email/Status.svelte -->
<script lang="ts">
    import { fly } from 'svelte/transition';
    export let type: 'error' | 'success';
    export let message: string;
</script>

{#if type === 'error'}
    <div 
        class="absolute -bottom-6 left-0 text-sm text-red-400"
        transition:fly={{ y: -10, duration: 200 }}
    >
        {message}
    </div>
{:else}
    <div 
        class="relative border border-zinc-800 rounded-lg p-6"
        in:fly={{ y: 20, duration: 300 }}
    >
        <div class="text-xl font-medium mb-2 text-zinc-200">
            You're on the launch pad! 🚀
        </div>
        <p class="text-zinc-400">
            {message}
        </p>
    </div>
{/if}