<!-- src/routes/news/[slug]/+page.svelte -->
<script>
	import { browser } from '$app/environment';
	import { ArrowLeft, Link, Copy } from 'phosphor-svelte';
	
	// Import existing components
	import ViralTitle from '$lib/features/news/card/ViralTitle.svelte';
	import Source from '$lib/features/news/card/Source.svelte';
	import DevJson from '$lib/features/news/card/DevJson.svelte';
	
	let { data } = $props();
	const { article } = data;
	
	let showJson = $state(false);
	
	function copyUrl() {
		navigator.clipboard.writeText(article.url);
	}
	
	// Analytics tracking on page view
	$effect(() => {
		if (browser) {
			// Analytics tracking would go here
		}
	});
</script>

<div class="max-w-4xl mx-auto px-4 py-20">
	<!-- Back button -->
	<div class="mb-8">
		<a href="/news" class="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
			<ArrowLeft class="w-5 h-5" />
			<span>Back to news</span>
		</a>
	</div>
	
	<article class="space-y-10">
		<!-- Hero section with titles -->
		<header class="space-y-6">
			<!-- Viral Title component -->
			<ViralTitle title={article.title} viralTitle={article.viral_title} />
			
			<!-- Source info component -->
			<Source 
				originalTitle={article.title} 
				source={article.source} 
				readTime={article.read_time} 
				publicationDate={article.publication_date}
			/>
		</header>
		
		<!-- Summary Section - New addition -->
		{#if article.summary}
			<div class="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 backdrop-blur-sm p-6">
				<h2 class="text-lg font-medium text-zinc-200 mb-4">Summary</h2>
				<p class="text-zinc-300 leading-relaxed">{article.summary}</p>
			</div>
		{/if}
		
		<!-- FOMO Score Card -->
		<div class="flex items-center gap-4 p-6 rounded-2xl bg-zinc-800/20 border border-zinc-700/50 backdrop-blur-sm">
			<div class="text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-fuchsia-500">
				{article.fomo_score || 0}
			</div>
			<div>
				<div class="text-zinc-300 font-medium">FOMO Score</div>
				<div class="text-zinc-500 text-sm">How much you'd miss out by not knowing</div>
			</div>
			{#if article.impact_score}
				<div class="ml-auto flex flex-col items-end">
					<div class="text-2xl font-medium text-zinc-200">{article.impact_score}</div>
					<div class="text-zinc-500 text-sm">Impact</div>
				</div>
			{/if}
		</div>
		
		<!-- Tags Section -->
		{#if article.tags?.length}
			<div class="space-y-3">
				<h2 class="text-sm font-medium text-zinc-400">Topics</h2>
				<div class="flex flex-wrap gap-2">
					{#each article.tags as tag}
						<span class="rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300">
							{tag}
						</span>
					{/each}
				</div>
			</div>
		{/if}
		
		<!-- Entities Grid -->
		{#if article.entities}
			<div class="space-y-4">
				<h2 class="text-sm font-medium text-zinc-400">Mentioned in this article</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#if article.entities.companies}
						<div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
							<h3 class="text-sm font-medium text-zinc-300 mb-3">Organizations</h3>
							<div class="space-y-2.5">
								{#each article.entities.companies as org}
									<div class="flex items-baseline justify-between">
										<span class="text-zinc-200">{org.name}</span>
										{#if org.role}<span class="text-zinc-500 text-sm">{org.role}</span>{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					{#if article.entities.people}
						<div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
							<h3 class="text-sm font-medium text-zinc-300 mb-3">Key People</h3>
							<div class="space-y-2.5">
								{#each article.entities.people as person}
									<div class="flex items-baseline justify-between">
										<span class="text-zinc-200">{person.name}</span>
										{#if person.role}<span class="text-zinc-500 text-sm">{person.role}</span>{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}
					
					{#if article.entities.technologies}
						<div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
							<h3 class="text-sm font-medium text-zinc-300 mb-3">Technologies</h3>
							<div class="space-y-2.5">
								{#each article.entities.technologies as tech}
									<div class="flex items-baseline justify-between">
										<span class="text-zinc-200">{tech.name}</span>
										{#if tech.status}<span class="text-zinc-500 text-sm">{tech.status}</span>{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}
					
					{#if article.entities.facilities}
						<div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
							<h3 class="text-sm font-medium text-zinc-300 mb-3">Facilities</h3>
							<div class="space-y-2.5">
								{#each article.entities.facilities as facility}
									<div class="flex items-baseline justify-between">
										<span class="text-zinc-200">{facility.name}</span>
										{#if facility.type}<span class="text-zinc-500 text-sm">{facility.type}</span>{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
		
		<!-- Timeline (if exists in context) -->
		{#if article.context?.timeline}
			<div class="space-y-4">
				<h2 class="text-sm font-medium text-zinc-400">Timeline</h2>
				<div class="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-5">
					{#if article.context.timeline.phase}
						<div class="mb-3">
							<span class="text-violet-400 font-medium">Phase:</span> 
							<span class="text-zinc-300">{article.context.timeline.phase}</span>
						</div>
					{/if}
					
					<div class="grid grid-cols-2 gap-4">
						{#if article.context.timeline.target_date}
							<div>
								<span class="text-zinc-500 text-sm">Target:</span>
								<div class="text-zinc-300">{article.context.timeline.target_date}</div>
							</div>
						{/if}
						
						{#if article.context.timeline.current_date}
							<div>
								<span class="text-zinc-500 text-sm">Current:</span> 
								<div class="text-zinc-300">{article.context.timeline.current_date}</div>
							</div>
						{/if}
						
						{#if article.context.timeline.official_date}
							<div>
								<span class="text-zinc-500 text-sm">Official:</span>
								<div class="text-zinc-300">{article.context.timeline.official_date}</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
		
		<!-- Footer Section -->
		<div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
			<button 
				type="button"
				class="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
				onclick={() => showJson = !showJson}
			>
				<span>{showJson ? 'Hide Raw Data' : 'Show Raw Data'}</span>
			</button>
			
			<div class="flex items-center gap-3">
				<button
					type="button"
					class="flex items-center gap-2 rounded-lg px-4 py-2 bg-zinc-800/70 text-zinc-300
							hover:bg-zinc-700 transition-colors"
					onclick={copyUrl}
				>
					<Copy class="h-4 w-4" />
					<span>Copy Link</span>
				</button>
				
				<a
					href={article.url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 rounded-lg px-4 py-2 bg-violet-600/80 text-white
							hover:bg-violet-500 transition-colors"
				>
					<Link class="h-4 w-4" />
					<span>Original Article</span>
				</a>
			</div>
		</div>
	</article>
	
	<!-- JSON Data Panel -->
	{#if showJson}
		<div class="mt-8">
			<DevJson 
				data={{
					context: article.context,
					entities: article.entities
				}}
				onClose={() => showJson = false}
			/>
		</div>
	{/if}
</div>