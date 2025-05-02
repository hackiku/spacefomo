<!-- src/lib/components/layout/Nav.svelte -->
<script lang="ts">
	import { List, X } from 'phosphor-svelte';
	import { fly } from 'svelte/transition';
	import SpacefomoLogo from '$lib/components/ui/SpacefomoLogo.svelte';
	import NavigationMenu from './NavigationMenu.svelte';
	import { browser } from '$app/environment';
	import AboutDrawer from '$lib/components/content/AboutDrawer.svelte';
	import { useNav } from '$lib/context/navContext.svelte';
	
	// Use the navigation context
	const nav = useNav();
	
	// Destructure what we need from the context
	const { 
		showAbout, 
		isMobileMenuOpen, 
		isHidden, 
		toggleMobileMenu, 
		updateScrollPosition,
		openAbout,
		closeAbout 
	} = nav;

	// Effect for scroll-hiding behavior
	$effect(() => {
		if (!browser) return;
		
		function handleScroll() {
			const currentScrollY = window.scrollY;
			updateScrollPosition(currentScrollY);
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
	
	// Close mobile menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (isMobileMenuOpen && event.target && !(event.target as HTMLElement).closest('.mobile-menu')) {
			toggleMobileMenu();
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<header
	class="fixed top-0 right-0 left-0 z-40 transition-transform duration-300"
	style:transform={isHidden ? 'translateY(-100%)' : 'translateY(0)'}
>
	<div class="max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
		<div class="flex h-16 items-center justify-between px-4">
			<!-- Logo -->
			<a href="/" class="flex items-center">
				<SpacefomoLogo size="md" />
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:block">
				<NavigationMenu />
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="inline-flex items-center justify-center text-zinc-400 hover:text-zinc-200 md:hidden"
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
			>
				{#if isMobileMenuOpen}
					<X class="h-6 w-6" />
				{:else}
					<List class="h-6 w-6" />
				{/if}
			</button>
		</div>
	</div>
	
	<!-- Mobile Menu Panel -->
	{#if isMobileMenuOpen}
		<div 
			class="mobile-menu absolute inset-x-0 top-16 z-40 origin-top transform bg-zinc-900 pb-4 shadow-md transition"
			transition:fly={{ y: -20, duration: 200 }}
		>
			<div class="px-4 pt-2 pb-3 space-y-1">
				<a 
					href="/api/v1/news" 
					class="block px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
				>
					API
				</a>
				<a 
					href="/news" 
					class="block px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
				>
					News
				</a>
				<a 
					href="/admin" 
					class="block px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
				>
					Admin
				</a>
				<button 
					class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
					onclick={openAbout}
				>
					About
				</button>
			</div>
		</div>
	{/if}
</header>

<!-- About Drawer (shared between mobile and desktop) -->
<AboutDrawer isOpen={showAbout} onClose={closeAbout} />
