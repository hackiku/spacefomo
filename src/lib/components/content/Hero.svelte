<!-- src/lib/layout/Hero.svelte -->
<script lang="ts">
	import { PlusCircle, Share } from 'phosphor-svelte';
	import ShareModal from '$lib/components/cta/share/ShareModal.svelte';
	import ShareButton from '$lib/components/cta/share/ShareButton.svelte';
	import EmailForm from '$lib/components/cta/email/EmailForm.svelte';

	let showShareModal = $state(false);
  
	function handleShareClick() {
		showShareModal = true;
	}
</script>

<div class="container mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 relative">
	<!-- Left-aligned content container -->
	<div class="max-w-xl md:max-w-2xl space-y-8 md:ml-0">
		<!-- Main Heading - more left-aligned -->
		<h1 class="text-4xl text-foreground font-light sm:text-5xl lg:text-6xl leading-tight">
			There's no place <br class="sm:hidden"/> like space
		</h1>

		<!-- Email signup form -->
		<div class="max-w-sm">
			<EmailForm />
		</div>
		
		<!-- Share button option -->
		<div class="hidden">
			<ShareButton onClick={handleShareClick}/>
		</div>
	</div>

	<!-- Tagline with arrow - positioned for desktop view -->
	<div class="hidden md:block absolute right-10 lg:right-36 bottom-0 transform translate-y-20">
		<div class="text-left rotate-6">
			<span class="text-space-gradient text-xl md:text-xl lg:text-2xl font-semibold inline-block">
				Hot space news<br/> ~100 words a pop
			</span>
			<div class="h-16 mt-2">
				<svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M75 5 C40 5, 20 5, 5 55" stroke="url(#arrow-gradient)" stroke-width="3" stroke-linecap="round"/>
					<path d="M15 45 L5 55 L20 55" stroke="url(#arrow-gradient)" stroke-width="3" transform="rotate(-48 6 57)" stroke-linecap="round" stroke-linejoin="round"/>
					<defs>
						<linearGradient id="arrow-gradient" x1="75" y1="5" x2="5" y2="55" gradientUnits="userSpaceOnUse">
							<stop stop-color="var(--venus-yellow)"/>
							<stop offset="1" stop-color="var(--venus-orange)"/>
						</linearGradient>
					</defs>
				</svg>
			</div>
		</div>
	</div>

	<!-- Future graphic placeholder -->
	<!-- <div class="hidden lg:block absolute top-0 right-0 bottom-0 w-1/3">
		Future graphic will go here
	</div> -->
</div>

<!-- Gradient Orb - using theme colors -->
<div
	class="absolute -top-24 -right-24 h-96 w-96 rounded-full
                bg-gradient-to-br from-primary/30 to-secondary/30
                opacity-20 blur-3xl"
></div>

<!-- Share Modal -->
{#if showShareModal}
	<ShareModal onClose={() => (showShareModal = false)} />
{/if}