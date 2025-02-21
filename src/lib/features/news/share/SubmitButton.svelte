<!-- src/lib/components/cta/share/SubmitButton.svelte -->
<script lang="ts">
    import { Envelope } from 'phosphor-svelte';
    
    let { status, disabled } = $props<{
        status: { loading: boolean };
        disabled: boolean;
    }>();
</script>

<button
    type="submit"
    {disabled}
    class="w-full flex items-center justify-center gap-2 px-6 py-3 
           bg-gradient-to-r from-violet-500 to-fuchsia-500
           hover:from-violet-600 hover:to-fuchsia-600
           disabled:opacity-50 disabled:cursor-not-allowed
           text-white rounded-lg transition-all"
>
    <Envelope weight="bold" class="w-5 h-5" />
    <span>{status.loading ? 'Sending...' : 'Share News'}</span>
</button>