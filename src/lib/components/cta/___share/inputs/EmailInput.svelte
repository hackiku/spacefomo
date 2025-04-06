<!-- src/lib/components/cta/share/inputs/EmailInput.svelte -->
<script lang="ts">
    let { value } = $props<{ value: string }>();
</script>

<div class="space-y-2">
    <label for="email" class="block text-sm font-medium text-zinc-400">
        Your email (optional)
    </label>
    <input
        id="email"
        type="email"
        bind:value
        placeholder="you@example.com"
        class="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/10
               text-zinc-100 placeholder:text-zinc-600
               focus:outline-none focus:ring-2 focus:ring-violet-500/20"
    />
</div>