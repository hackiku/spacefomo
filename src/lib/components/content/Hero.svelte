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

<!-- <div class="container mx-auto __text-center px-6 sm:px-12 md:px-32 lg:px-44 xl:px-72 relative"> -->
<div class="container space-y-6 mx-auto __text-center px-6 sm:px-12 md:px-24 lg:px-32 xl:px-72 relative">
	<!-- Main Heading -->
	<h1
		class="text-4xl text-foreground
                   font-regular sm:text-5xl lg:text-6xl"
	>
		There's no place <br/> like space
	</h1>

	<!-- <ShareButton onClick={handleShareClick}/> -->
	<EmailForm />

	<!-- 100 words tagline with arrow -->
	<div class="absolute -bottom-36 right-6 md:right-12 lg:right-20 xl:right-24 __hidden md:flex items-end">
		<div class="text-left rotate-6">
			<span class="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 text-xl md:text-xl lg:text-2xl
					font-semibold inline-block">
				Hot space news<br/> ~100 words a pop
			</span>
			<div class="h-16 mt-2">
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
                opacity-20 blur-3xl"
></div>

<!-- Share Modal -->
{#if showShareModal}
	<ShareModal onClose={() => (showShareModal = false)} />
{/if}