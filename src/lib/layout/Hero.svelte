<!-- src/lib/layout/Hero.svelte -->
<script lang="ts">
	import ShareButton from '$lib/components/cta/ShareButton.svelte';
	import ShareModal from '../features/news/share/ShareModal.svelte';

	let showShareModal = $state(false);
  
	function handleShareClick() {
		showShareModal = true;
	}
</script>

<div class="container mx-auto text-center px-6 sm:px-12 md:px-32 lg:px-44 xl:px-72 relative">
	<!-- Main Heading -->
	<h1
		class="mb-6 text-4xl text-white
                   font-bold sm:text-5xl lg:text-6xl"
	>
		There's no place <br/> like space
	</h1>

	<!-- Share Button -->
	<div class="mb-12">
		<ShareButton onClick={handleShareClick} />
	</div>
  
	<!-- 100 words tagline with arrow -->
	<div class="absolute -bottom-42 md:-bottom-36 right-6 md:right-20 lg:right-16 flex items-end">
	<div class="text-left rotate-6">
			<span class="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 text-xl md:text-2xl lg:text-3xl font-semibold inline-block">
				Space news in ~100 <br/> words a pop
			</span>
			<div class="h-16 mt-2">
				<!-- Arrow SVG pointing down-left -->
				<svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M75 5 C40 5, 20 5, 5 55" stroke="url(#arrow-gradient)" stroke-width="3" stroke-linecap="round"/>
					<path d="M15 45 L5 55 L20 55" stroke="url(#arrow-gradient)" stroke-width="3" transform="rotate(-48 6 57)" stroke-linecap="round" stroke-linejoin="round"/>
					<defs>
						<linearGradient id="arrow-gradient" x1="75" y1="5" x2="5" y2="55" gradientUnits="userSpaceOnUse">
							<stop stop-color="#A78BFA"/>
							<stop offset="1" stop-color="#E879F9"/>
						</linearGradient>
					</defs>
				</svg>
			</div>
		</div>
	</div>
</div>

<!-- Gradient Orb -->
<div
	class="absolute -top-24 -right-24 h-96 w-96 rounded-full
                bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30
                opacity-50 blur-3xl"
></div>

<!-- Share Modal -->
{#if showShareModal}
	<ShareModal onClose={() => (showShareModal = false)} />
{/if}