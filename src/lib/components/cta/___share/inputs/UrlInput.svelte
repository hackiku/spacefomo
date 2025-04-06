<!-- src/lib/components/cta/share/UrlInput.svelte -->
<script lang="ts">
    let { value } = $props<{
        value: string;
    }>();
</script>

<div class="space-y-2">
    <label for="url" class="block text-sm font-medium text-zinc-400">
        News URL
    </label>
    <input
        id="url"
        type="url"
        bind:value
        placeholder="https://..."
        class="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/10
               text-zinc-100 placeholder:text-zinc-600
               focus:outline-none focus:ring-2 focus:ring-violet-500/20"
    />
</div>