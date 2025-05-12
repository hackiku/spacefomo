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
		toggleMobileMenu, 
		openAbout,
		closeAbout 
	} = nav;
	
	// Close mobile menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (isMobileMenuOpen && event.target && !(event.target as HTMLElement).closest('.mobile-menu')) {
			toggleMobileMenu();
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<header class="h-full w-full z-50">
	<div class="h-full flex items-center justify-between px-3 md:px-6">
		<!-- Logo -->
		<a href="/" class="flex items-center">
			<SpacefomoLogo size="md" />
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden md:block z-50">
			<NavigationMenu />
		</div>

		<!-- Mobile Menu Button -->
		<button
			class="inline-flex items-center justify-center text-muted-foreground hover:text-foreground md:hidden"
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
	
	<!-- Mobile Menu Panel -->
	{#if isMobileMenuOpen}
		<div 
			class="mobile-menu absolute inset-x-0 top-16 z-40 origin-top transform bg-background pb-4 shadow-md transition"
			transition:fly={{ y: -20, duration: 200 }}
		>
			<div class="px-4 pt-2 pb-3 space-y-1">
				<a 
					href="/api/v1/news" 
					class="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10"
				>
					API
				</a>
				<a 
					href="/news" 
					class="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10"
				>
					News
				</a>
				<a 
					href="/admin" 
					class="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10"
				>
					Admin
				</a>
				<button 
					class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10"
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