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

<div class="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4 backdrop-blur-sm">
	<div class="mb-3 flex items-center gap-2">
		<Share class="h-4 w-4 text-zinc-500" />
		<span class="text-xs text-zinc-500 uppercase tracking-wider">Actions</span>
	</div>
	
	<div class="space-y-3">
		<button
			type="button"
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200
					hover:bg-zinc-700 transition-colors"
			onclick={copyUrl}
		>
			<Copy class="h-4 w-4" />
			<span>{copied ? 'Copied!' : 'Copy Link'}</span>
		</button>
		
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm text-white
					hover:from-violet-500 hover:to-fuchsia-500 transition-colors"
		>
			<Link class="h-4 w-4" />
			<span>Read Original</span>
		</a>
	</div>
</div>