<!-- src/routes/news/[slug]/ArticleButtons.svelte -->
<script lang="ts">
	import { Copy, Link, Share } from 'phosphor-svelte';
	
	let { url } = $props<{
		url: string;
	}>();
	
	let copied = $state(false);
	
	function copyUrl() {
		navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<div class="rounded-default border border-border bg-card p-4 backdrop-blur-sm">
	<div class="mb-3 flex items-center gap-2">
		<Share class="h-4 w-4 text-muted-foreground" />
		<span class="text-xs text-muted-foreground uppercase tracking-wider">Actions</span>
	</div>
	
	<div class="space-y-3">
		<button
			type="button"
			class="group relative flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm
                 bg-muted border border-border text-muted-foreground
                 hover:text-foreground transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/10
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0"
			onclick={copyUrl}
		>
			<Copy class="h-4 w-4" />
			<span>{copied ? 'Copied!' : 'Copy Link'}</span>
		</button>
		
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			class="group relative flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm
                 bg-primary text-primary-foreground
                 hover:bg-primary/90 transition-colors
                 before:absolute before:inset-0
                 before:border before:border-primary/50
                 before:translate-x-0.5 before:translate-y-0.5
                 before:transition-transform before:duration-300
                 hover:before:translate-x-0 hover:before:translate-y-0"
		>
			<Link class="h-4 w-4" />
			<span>Read Original</span>
		</a>
	</div>
</div>