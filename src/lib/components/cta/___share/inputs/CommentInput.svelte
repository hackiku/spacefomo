<!-- src/lib/components/cta/share/inputs/CommentInput.svelte -->
<script lang="ts">
    let { value } = $props<{ value: string }>();
</script>

<div class="space-y-2">
    <label for="comment" class="block text-sm font-medium text-zinc-400">
        Why is this interesting?
    </label>
    <textarea
        id="comment"
        bind:value
        rows="3"
        class="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/10
               text-zinc-100 placeholder:text-zinc-600
               focus:outline-none focus:ring-2 focus:ring-violet-500/20"
    />
</div>