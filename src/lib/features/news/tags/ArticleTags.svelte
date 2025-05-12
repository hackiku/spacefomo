<!-- src/lib/features/news/tags/ArticleTags.svelte -->
<script lang="ts">
	import { Tag } from 'phosphor-svelte';
	
	let { tags, limit } = $props<{
		tags: string[];
		limit?: number;
	}>();
	
	// If no limit is provided, show all tags
	const displayLimit = limit || tags.length;
	const displayTags = $derived(tags.slice(0, displayLimit));
	const hasMoreTags = $derived(tags.length > displayLimit);
</script>

<div class="rounded-default border border-border bg-card p-4 backdrop-blur-sm">
	<div class="mb-3 flex items-center gap-2">
		<Tag class="h-4 w-4 text-muted-foreground" />
		<span class="text-xs text-muted-foreground uppercase tracking-wider">Topics</span>
	</div>
	
	<div class="flex flex-wrap gap-2">
		{#each displayTags as tag}
			<span class="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
				{tag}
			</span>
		{/each}
		
		{#if hasMoreTags}
			<span class="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
				+{tags.length - displayLimit} more
			</span>
		{/if}
	</div>
</div>