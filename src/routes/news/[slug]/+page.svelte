<!-- src/routes/news/[slug]/+page.svelte -->
<script>
	import { browser } from '$app/environment';
	import { ArrowLeft } from 'phosphor-svelte';
	
	// Import existing components
	import ViralTitle from '$lib/features/news/card/ViralTitle.svelte';
	import Source from '$lib/features/news/card/Source.svelte';
	import DevJson from '$lib/features/news/card/DevJson.svelte';
	
	// Import local components
	import SlugSidebar from './SlugSidebar.svelte';
	
	let { data } = $props();
	const { article } = data;
	
	let showJson = $state(false);
	
	// Analytics tracking on page view
	$effect(() => {
		if (browser) {
			// Analytics tracking would go here
		}
	});
</script>

<div class="max-w-5xl mx-auto px-4 py-12">
	<!-- Back button -->
	<div class="mb-8">
		<a href="/news" class="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
			<ArrowLeft class="w-5 h-5" />
			<span>Back to news</span>
		</a>
	</div>
	
	<div class="flex flex-col lg:flex-row gap-8">
		<!-- Main Content Column -->
		<div class="flex-1 space-y-10">
			<!-- Title -->
			<ViralTitle title={article.title} viralTitle={article.viral_title} />
			
			<!-- Source info -->
			<Source 
				originalTitle={article.title} 
				source={article.source} 
				readTime={article.read_time} 
				publicationDate={article.publication_date}
			/>
			
			<!-- Summary Section -->
			{#if article.summary}
				<div class="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 backdrop-blur-sm p-6">
					<h2 class="text-lg font-medium text-zinc-200 mb-4">Summary</h2>
					<p class="text-zinc-300 leading-relaxed">{article.summary}</p>
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
			
			<!-- Raw Data Toggle Button -->
			<div class="flex items-center justify-between pt-4 border-t border-zinc-800">
				<button 
					type="button"
					class="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
					onclick={() => showJson = !showJson}
				>
					<span>{showJson ? 'Hide Raw Data' : 'Show Raw Data'}</span>
				</button>
			</div>
			
			<!-- JSON Data Panel -->
			{#if showJson}
				<div>
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
		
		<!-- Sidebar -->
		<SlugSidebar {article} />
	</div>
</div>