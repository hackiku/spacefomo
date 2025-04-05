<!-- src/routes/news/[slug]/+page.svelte -->
<script>
	import { browser } from '$app/environment';
	import { ArrowLeft, ArrowSquareOut, Rocket } from 'phosphor-svelte';
	
	let { data } = $props();
	const { article } = data;
	
	// Format date helper
	function formatDate(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	
	// Analytics tracking on page view
	$effect(() => {
		if (browser) {
			// Analytics tracking would go here
		}
	});
</script>

<div class="max-w-3xl mx-auto px-4 py-12">
	<!-- Back button -->
	<div class="mb-8">
		<a href="/news" class="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
			<ArrowLeft class="w-5 h-5" />
			<span>Back to news</span>
		</a>
	</div>
	
	<article class="space-y-8">
		<!-- Header section -->
		<header class="space-y-4">
			<!-- Viral title -->
			<h1 class="text-3xl md:text-4xl font-medium text-zinc-100">
				{article.viral_title || article.title}
			</h1>
			
			<!-- Original title if different -->
			{#if article.viral_title && article.viral_title !== article.title}
				<h2 class="text-xl text-zinc-400">
					{article.title}
				</h2>
			{/if}
			
			<!-- Metadata row -->
			<div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500">
				{#if article.source}
					<span>{article.source}</span>
					<span class="text-zinc-700">•</span>
				{/if}
				
				{#if article.publication_date}
					<span>{formatDate(article.publication_date)}</span>
					<span class="text-zinc-700">•</span>
				{/if}
				
				{#if article.read_time}
					<span>{article.read_time} min read</span>
				{/if}
			</div>
		</header>
		
		<!-- Tags -->
		{#if article.tags?.length}
			<div class="flex flex-wrap gap-2">
				{#each article.tags as tag}
					<span class="rounded-full border border-zinc-800 px-3 py-1 text-sm text-zinc-400">
						{tag}
					</span>
				{/each}
			</div>
		{/if}
		
		<!-- FOMO Score -->
		<div class="flex items-center gap-3 p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
			<div class="text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-fuchsia-500">
				{article.fomo_score || 0}
			</div>
			<div class="text-zinc-400">
				FOMO Score
			</div>
			{#if article.impact_score}
				<div class="ml-auto flex items-center gap-2 text-zinc-500">
					<span>Impact</span>
					<span class="text-xl text-zinc-300">{article.impact_score}</span>
				</div>
			{/if}
		</div>
		
		<!-- Entities section -->
		{#if article.entities}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Organizations -->
				{#if article.entities.companies?.length}
					<div class="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
						<h3 class="text-sm font-medium text-zinc-300 mb-3">Organizations</h3>
						<div class="space-y-2">
							{#each article.entities.companies as org}
								<div class="text-sm">
									<span class="text-zinc-200">{org.name}</span>
									{#if org.role}<span class="text-zinc-500"> • {org.role}</span>{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
				
				<!-- People -->
				{#if article.entities.people?.length}
					<div class="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
						<h3 class="text-sm font-medium text-zinc-300 mb-3">Key People</h3>
						<div class="space-y-2">
							{#each article.entities.people as person}
								<div class="text-sm">
									<span class="text-zinc-200">{person.name}</span>
									{#if person.role}<span class="text-zinc-500"> • {person.role}</span>{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
		
		<!-- Original article link -->
		<div class="pt-4">
			<a 
				href={article.url} 
				target="_blank" 
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
			>
				<span>Read original article</span>
				<ArrowSquareOut class="w-4 h-4" />
			</a>
		</div>
	</article>
</div>