<!-- src/lib/layout/Nav.svelte -->
<script lang="ts">
	import { Info, X } from 'phosphor-svelte';
	import Logo from '$lib/components/branding/Logo.svelte';
	import AboutDrawer from '$lib/components/contact/AboutDrawer.svelte';

	let showAbout = $state(false);
	let lastScrollY = $state(0);
	let isHidden = $state(false);

	$effect(() => {
		function handleScroll() {
			const currentScrollY = window.scrollY;
			isHidden = currentScrollY > lastScrollY && currentScrollY > 50;
			lastScrollY = currentScrollY;
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="fixed top-0 right-0 left-0 z-40 transition-transform duration-300"
	style:transform={isHidden ? 'translateY(-100%)' : 'translateY(0)'}
>
	<div class="max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
		<div class="flex h-16 items-center justify-between px-4">
			<!-- Logo -->
			<a href="/" class="flex items-center">
				<Logo size="md" />
			</a>

			<!-- Actions -->
			<div class="flex items-center gap-6">
								<a
					href="https://rapidapi.com/search?sortBy=ByRelevance"
					target="_blank"
					rel="noopener noreferrer"
					class="text-zinc-400 transition-all hover:scale-110 hover:text-zinc-200"
				>API
				</a>
			<div class="flex items-center gap-6">
								<a
					href="/news"
					class="text-zinc-400 transition-all hover:scale-110 hover:text-zinc-200"
				>news
				</a>
				<button
					class="text-zinc-400 transition-colors hover:text-zinc-200"
					onclick={() => (showAbout = !showAbout)}
				>
					{#if showAbout}
						<X class="h-6 w-6" />
					{:else}
						<Info class="h-6 w-6" />
					{/if}
				</button>


			</div>
		</div>
	</div>
</header>

<AboutDrawer isOpen={showAbout} onClose={() => (showAbout = false)} />
