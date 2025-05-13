<!-- src/routes/news/+page.svelte -->
<script>
	let { data } = $props();
	const { articles, error } = data;
	
	function formatDate(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="max-w-6xl mx-auto px-4 py-8 font-mono">
	<h1 class="text-2xl font-bold text-zinc-200 mb-6">News Debug View</h1>
	
	{#if error}
		<div class="p-4 border border-red-800 bg-red-900/20 text-red-400 rounded mb-6">
			Error: {error}
		</div>
	{:else if !articles || articles.length === 0}
		<div class="p-4 border border-zinc-700 bg-zinc-800/30 text-zinc-400 rounded">
			No articles found in database.
		</div>
	{:else}
		<div class="mb-4 text-zinc-400 text-sm">
			Found {articles.length} articles
		</div>
		
		<div class="space-y-4">
			{#each articles as article (article.id)}
				<div class="p-4 border border-zinc-700 bg-zinc-800/30 rounded hover:border-zinc-600 transition-colors">
					<div class="flex justify-between mb-2">
						<span class="text-xs text-zinc-500">ID: {article.id}</span>
						<span class="text-xs text-zinc-500">FOMO: {article.fomo_score}</span>
					</div>
					
					<h2 class="text-lg text-zinc-200 mb-1">
						<a href={`/news/${article.slug}`} class="hover:text-violet-400 transition-colors">
							{article.viral_title || article.title}
						</a>
					</h2>
					
					<div class="text-sm text-zinc-400 mb-2">
						<span>{article.source || 'Unknown source'}</span>
						{#if article.publication_date}
							<span class="mx-1">•</span>
							<span>{formatDate(article.publication_date)}</span>
						{/if}
					</div>
					
					<div class="flex gap-x-2 flex-wrap text-xs">
						<span class="text-zinc-500">Slug:</span>
						<code class="text-emerald-400">{article.slug}</code>
					</div>
					
					{#if article.tags?.length}
						<div class="mt-2 flex flex-wrap gap-2">
							{#each article.tags as tag}
								<span class="inline-block px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
									{tag}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>